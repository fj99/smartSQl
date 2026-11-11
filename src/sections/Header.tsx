import { useState } from "react";
import { content } from "../content";
import { homeHref } from "../route";

export function Header() {
  const { brand, navigation } = content;
  const [open, setOpen] = useState(false);

  return (
    <header className="topbar">
      <a className="brand" href={homeHref("#top")} aria-label={brand.homeLabel} onClick={() => setOpen(false)}>
        <span className="brand-mark">{brand.mark}</span>
        {brand.name}
      </a>
      <p className="location">{brand.location}</p>
      <nav className={open ? "is-open" : undefined} aria-label={navigation.ariaLabel}>
        {navigation.items.map((item) => (
          <a key={item.href} href={homeHref(item.href)} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
      </nav>
      <p className="status">
        <i aria-hidden="true" />
        {brand.status}
      </p>
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-label={open ? navigation.closeLabel : navigation.menuLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
    </header>
  );
}
