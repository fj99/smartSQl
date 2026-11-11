import { useEffect, useState } from "react";

function siteBase() {
  return import.meta.env.BASE_URL.replace(/\/$/, "");
}

function sitePath(pathname: string) {
  const base = siteBase();
  if (!base || !pathname.startsWith(base)) return pathname;
  const rest = pathname.slice(base.length);
  return rest.startsWith("/") ? rest : `/${rest}`;
}

export function productPath(slug: string) {
  return `${import.meta.env.BASE_URL}products/${slug}`;
}

export function productSlug(pathname: string) {
  const match = sitePath(pathname).match(/^\/products\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function homeHref(href: string) {
  return href.startsWith("#") ? `${import.meta.env.BASE_URL}${href}` : href;
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
