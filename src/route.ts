import { useEffect, useState } from "react";

export function productPath(slug: string) {
  return `/products/${slug}`;
}

export function productSlug(pathname: string) {
  const match = pathname.match(/^\/products\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function homeHref(href: string) {
  return href.startsWith("#") ? `/${href}` : href;
}

export function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  return pathname;
}

export function go(to: string) {
  if (to === window.location.pathname) return;
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}
