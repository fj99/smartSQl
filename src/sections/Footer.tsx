import { content } from "../content";
import { homeHref } from "../route";

export function Footer() {
  const { footer } = content;

  return (
    <footer className="colophon">
      <span>{footer.copyright}</span>
      <span>{footer.note}</span>
      <a href={homeHref("#top")}>{footer.top}</a>
    </footer>
  );
}
