import { content, type Product } from "../content";
import { homeHref } from "../route";

interface ProductDocProps {
  product: Product | undefined;
}

export function ProductDoc({ product }: ProductDocProps) {
  const { products } = content;

  if (!product) {
    return (
      <main className="doc">
        <a className="doc-back" href={homeHref(`#${products.id}`)}>
          {products.docBack}
        </a>
        <h1>{products.docMissingTitle}</h1>
        <p className="doc-lead">{products.docMissingBody}</p>
      </main>
    );
  }

  return (
    <main className="doc">
      <a className="doc-back" href={homeHref(`#${products.id}`)}>
        {products.docBack}
      </a>
      <p className="doc-kicker">{products.docEyebrow}</p>
      <h1>{product.name}</h1>
      <p className="doc-meta">
        <span>{product.category}</span>
        <span>{product.year}</span>
      </p>
      <p className="doc-lead">{product.description}</p>
      <div className="doc-layout">
        <nav className="doc-nav" aria-label={products.docEyebrow}>
          {product.docs.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.heading}
            </a>
          ))}
        </nav>
        <div className="doc-body">
          {product.docs.map((section) => (
            <section key={section.id} id={section.id}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
