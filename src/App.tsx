import { useEffect, useState } from "react";
import { content } from "./content";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { PointOfView } from "./sections/PointOfView";
import { Products } from "./sections/Products";
import { Team } from "./sections/Team";

export function App() {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  const product = content.products.items[active] ?? content.products.items[0];

  useEffect(() => {
    document.title = content.meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", content.meta.description);
  }, []);

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
      <main>
        <Hero product={product} active={active} onSelect={(index) => showProduct(index, false)} />
        <PointOfView />
        <Products active={active} onSelect={(index) => showProduct(index, true)} />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
