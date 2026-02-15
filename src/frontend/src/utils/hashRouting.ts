// Hash-based routing utilities for client-side navigation

export type PageType = 'home' | 'login' | 'dashboard' | 'admin-login' | 'admin-dashboard';

/**
 * Parse the current URL hash into a PageType
 * Returns 'home' for empty or unrecognized hashes
 */
export function parseHashToPage(): PageType {
  const hash = window.location.hash.slice(1); // Remove the '#'
  
  switch (hash) {
    case 'login':
      return 'login';
    case 'dashboard':
      return 'dashboard';
    case 'admin-login':
      return 'admin-login';
    case 'admin-dashboard':
      return 'admin-dashboard';
    default:
      return 'home';
  }
}

/**
 * Convert a PageType to its canonical hash string
 */
export function pageToHash(page: PageType): string {
  if (page === 'home') {
    return '';
  }
  return page;
}

/**
 * Update the URL hash without triggering a page reload
 * Uses hash-based navigation consistently to ensure hashchange events fire
 */
export function setPageHash(page: PageType): void {
  const hash = pageToHash(page);
  if (hash) {
    window.location.hash = hash;
  } else {
    // For home page, set hash to empty string which triggers hashchange
    // This ensures consistent behavior with browser back/forward
    if (window.location.hash) {
      window.location.hash = '';
    }
  }
}
