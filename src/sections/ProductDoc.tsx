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
          <a href="#documents">{products.pdfHeading}</a>
          {product.docs.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.heading}
            </a>
          ))}
        </nav>
        <div className="doc-body">
          <section id="documents">
            <h2>{products.pdfHeading}</h2>
            {product.pdfs.length === 0 ? (
              <p>{products.pdfEmpty}</p>
            ) : (
              <div className="doc-files">
                {product.pdfs.map((pdf) => (
                  <a key={pdf.file} href={pdf.file} target="_blank" rel="noopener noreferrer">
                    <span>{pdf.title}</span>
                    <span>{products.pdfOpen}</span>
                  </a>
                ))}
              </div>
            )}
          </section>
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
