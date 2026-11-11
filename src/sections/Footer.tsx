import { content } from "../content";

export function Footer() {
  const { footer } = content;

  return (
    <footer className="colophon">
      <span>{footer.copyright}</span>
      <span>{footer.note}</span>
      <a href="#top">{footer.top}</a>
    </footer>
  );
}
