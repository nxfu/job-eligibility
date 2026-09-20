import { useState, useEffect, useCallback } from 'react';

export type Page = 'home' | 'profile' | 'history';

const ROUTE_MAP: Record<string, Page> = {
  '/': 'home',
  '/profile': 'profile',
  '/history': 'history',
};

const PAGE_TO_PATH: Record<Page, string> = {
  'home': '/',
  'profile': '/profile',
  'history': '/history',
};

function getPageFromPath(pathname: string): Page {
  return ROUTE_MAP[pathname] || 'home';
}

export function useRouter() {
  const [currentPage, setCurrentPage] = useState<Page>(() =>
    getPageFromPath(window.location.pathname)
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((page: Page) => {
    const path = PAGE_TO_PATH[page];
    if (window.location.pathname !== path) {
      history.pushState(null, '', path);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  }, []);

  return { currentPage, navigate };
}
