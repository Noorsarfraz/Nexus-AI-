/**
 * Backend API tests
 * -------------------------------------------------------------------------
 * Tooling: Jest + Supertest + mongodb-memory-server
 *
 * These tests spin up a real (but temporary, in-memory) MongoDB instance so
 * that every request goes through the actual Mongoose models — no mocking
 * of the database layer. Cloudinary-backed routes (/api/uploads,
 * /api/nodes/deploy) are intentionally NOT covered here since they need a
 * live network call to a third-party service; see README "Testing" section
 * for details.
 *
 * IMPORTANT: MONGO_URI must be set to the in-memory server's URI BEFORE
 * `../server` is required, since server.js calls connectDB() as soon as
 * it's loaded. Mongoose buffers queries until the connection is ready, so
 * there's no race condition even though we don't explicitly await it here.
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');

let mongoServer;
let app;

beforeAll(async () => {
  // Default launch timeout (10s) is too tight on some machines, especially
  // Windows on the very first run (antivirus scanning the new mongod.exe,
  // slower disk, etc.) — 60s gives it enough headroom.
  mongoServer = await MongoMemoryServer.create({
    instance: {
      launchTimeout: 60000,
    },
  });
  process.env.MONGO_URI = mongoServer.getUri();
  process.env.JWT_SECRET = 'test_jwt_secret';

  // Required only after MONGO_URI is set, so connectDB() targets the
  // in-memory instance instead of any real database.
  app = require('../server');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// ---------------------------------------------------------------------
// Helper: create + log in a user, return the bearer token
// ---------------------------------------------------------------------
async function signupAndLogin(email, password = 'Password123!') {
  await request(app).post('/api/signup').send({ email, password });
  const loginRes = await request(app).post('/api/login').send({ email, password });
  return loginRes.body.token;
}

describe('POST /api/signup', () => {
  it('creates a new user and returns 201 (happy path)', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({ email: 'signup-happy@nexus.ai', password: 'Password123!' });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/registered successfully/i);
  });

  it('rejects signup with missing email/password (failure case)', async () => {
    const res = await request(app).post('/api/signup').send({ email: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  it('rejects signup with a duplicate email (failure case)', async () => {
    await request(app)
      .post('/api/signup')
      .send({ email: 'dup@nexus.ai', password: 'Password123!' });

    const res = await request(app)
      .post('/api/signup')
      .send({ email: 'dup@nexus.ai', password: 'Password123!' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });
});

describe('POST /api/login', () => {
  it('logs in with correct credentials and returns a JWT (happy path)', async () => {
    await request(app)
      .post('/api/signup')
      .send({ email: 'login-happy@nexus.ai', password: 'Password123!' });

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'login-happy@nexus.ai', password: 'Password123!' });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.plan).toBe('Developer');
  });

  it('rejects login with the wrong password (failure case)', async () => {
    await request(app)
      .post('/api/signup')
      .send({ email: 'login-wrongpass@nexus.ai', password: 'Password123!' });

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'login-wrongpass@nexus.ai', password: 'WrongPassword!' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid email or password/i);
  });
});

describe('GET /api/nodes', () => {
  it('rejects requests without a bearer token (failure case)', async () => {
    const res = await request(app).get('/api/nodes');

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/no token provided/i);
  });

  it('returns only the authenticated user\'s nodes (happy path)', async () => {
    const token = await signupAndLogin('nodes-list@nexus.ai');

    const res = await request(app)
      .get('/api/nodes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });
});

describe('POST /api/nodes', () => {
  it('creates a node for the authenticated user (happy path)', async () => {
    const token = await signupAndLogin('nodes-create@nexus.ai');

    const res = await request(app)
      .post('/api/nodes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'GPT-5 Neural Core', status: 'Active' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('GPT-5 Neural Core');
    expect(res.body.userEmail).toBe('nodes-create@nexus.ai');

    // Confirm it now shows up in the list endpoint too
    const listRes = await request(app)
      .get('/api/nodes')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.body).toHaveLength(1);
  });

  it('rejects node creation without a title (failure case)', async () => {
    const token = await signupAndLogin('nodes-create-fail@nexus.ai');

    const res = await request(app)
      .post('/api/nodes')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title is required/i);
  });
});

describe('PUT /api/nodes/:id and DELETE /api/nodes/:id', () => {
  it('updates a node the user owns (happy path)', async () => {
    const token = await signupAndLogin('nodes-update@nexus.ai');

    const createRes = await request(app)
      .post('/api/nodes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Old Name', status: 'Active' });

    const nodeId = createRes.body._id;

    const updateRes = await request(app)
      .put(`/api/nodes/${nodeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Name', status: 'Maintenance' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.title).toBe('Updated Name');
    expect(updateRes.body.status).toBe('Maintenance');
  });

  it('deletes a node, then 404s on a second delete of the same id (failure case)', async () => {
    const token = await signupAndLogin('nodes-delete@nexus.ai');

    const createRes = await request(app)
      .post('/api/nodes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Node To Delete', status: 'Active' });

    const nodeId = createRes.body._id;

    const firstDelete = await request(app)
      .delete(`/api/nodes/${nodeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(firstDelete.status).toBe(200);

    const secondDelete = await request(app)
      .delete(`/api/nodes/${nodeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(secondDelete.status).toBe(404);
    expect(secondDelete.body.error).toMatch(/not found/i);
  });
});

describe('GET /api/user/plan', () => {
  it('returns the authenticated user\'s plan (happy path)', async () => {
    const token = await signupAndLogin('plan-check@nexus.ai');

    const res = await request(app)
      .get('/api/user/plan')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.plan).toBe('Developer');
  });

  it('rejects an invalid/garbage token (failure case)', async () => {
    const res = await request(app)
      .get('/api/user/plan')
      .set('Authorization', 'Bearer not-a-real-token');

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/invalid or expired token/i);
  });
});
