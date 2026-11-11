import type { CSSProperties, MouseEvent } from "react";
import { content } from "../content";
import { go, productPath } from "../route";
import { SectionLabel } from "./SectionLabel";

interface ProductsProps {
  active: number;
  onSelect: (index: number) => void;
}

export function Products({ active, onSelect }: ProductsProps) {
  const { products } = content;

  return (
    <section className="chapter chapter-ink" id={products.id}>
      <SectionLabel index={products.index} label={products.eyebrow} />
      <div className="catalog-head">
        <h2>{products.title}</h2>
        <span>{products.countLabel}</span>
      </div>
      <div className="catalog-grid">
        {products.items.map((item, index) => {
          const href = productPath(item.slug);
          function openDoc(event: MouseEvent<HTMLAnchorElement>) {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
              return;
            }
            event.preventDefault();
            go(href);
          }
          return (
            <article
              key={item.number}
              className={index === active ? "is-active" : undefined}
              style={{ "--swatch": item.color } as CSSProperties}
            >
              <a
                className="glyph"
                data-scene={item.scene}
                href={href}
                aria-label={`${products.docLinkLabel} ${item.name}`}
                onClick={openDoc}
              >
                <div className="glyph-spin">
                  <span />
                  <span />
                  <span />
                </div>
              </a>
              <button
                type="button"
                aria-pressed={index === active}
                aria-label={`${products.openLabel}: ${item.name}`}
                onClick={() => onSelect(index)}
              >
                <span className="card-index">{item.number}</span>
                <div className="card-copy">
                  <h3>{item.name}</h3>
                  <p>{item.category}</p>
                </div>
              </button>
              <a className="card-foot" href={href} aria-label={`${products.docLinkLabel} ${item.name}`} onClick={openDoc}>
                <span>{item.year}</span>
                <i aria-hidden="true">{products.arrow}</i>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
