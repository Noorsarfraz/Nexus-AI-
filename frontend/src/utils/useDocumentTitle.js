import { useEffect } from 'react';

// Sets a per-page <title> so each route in the SPA gets a distinct,
// descriptive title instead of the single static index.html title.
export default function useDocumentTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} · Nexus AI` : 'Nexus AI';
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
