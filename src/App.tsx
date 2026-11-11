import { useEffect, useState } from "react";
import { content } from "./content";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { productSlug, usePathname } from "./route";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { PointOfView } from "./sections/PointOfView";
import { ProductDoc } from "./sections/ProductDoc";
import { Products } from "./sections/Products";
import { Team } from "./sections/Team";

export function App() {
  const [active, setActive] = useState(0);
  const pathname = usePathname();
  const slug = productSlug(pathname);
  const documented = slug
    ? content.products.items.find((item) => item.slug === slug)
    : undefined;
  const reduced = usePrefersReducedMotion();
  const product = content.products.items[active] ?? content.products.items[0];

  useEffect(() => {
    const title = documented
      ? `${documented.name} — ${content.products.docEyebrow}`
      : content.meta.title;
    const description = documented?.description ?? content.meta.description;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    window.scrollTo(0, 0);
  }, [pathname, documented]);

  function showProduct(index: number, scroll: boolean) {
    setActive(index);
    if (!scroll) return;
    document.getElementById("top")?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
    });
  }

  return (
    <>
      <Header />
      {slug ? (
        <ProductDoc product={documented} />
      ) : (
        <main>
          <Hero product={product} active={active} onSelect={(index) => showProduct(index, false)} />
          <PointOfView />
          <Products active={active} onSelect={(index) => showProduct(index, true)} />
          <Team />
          <Contact />
        </main>
      )}
      <Footer />
    </>
  );
}
