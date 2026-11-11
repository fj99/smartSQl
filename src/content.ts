import raw from "./content.json";

export type SceneKind = "lattice" | "ribbon" | "knot";

export interface NavItem {
  label: string;
  href: string;
}

export interface DocSection {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface Product {
  number: string;
  name: string;
  category: string;
  year: string;
  description: string;
  slug: string;
  scene: SceneKind;
  color: string;
  secondary: string;
  docs: DocSection[];
}

export interface Teammate {
  number: string;
  name: string;
  role: string;
  body: string;
}

export interface SiteContent {
  meta: { title: string; description: string };
  brand: {
    name: string;
    mark: string;
    homeLabel: string;
    location: string;
    status: string;
  };
  navigation: {
    menuLabel: string;
    closeLabel: string;
    ariaLabel: string;
    items: NavItem[];
  };
  hero: {
    spark: string;
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    body: string;
    cta: string;
    ctaIcon: string;
    ctaHref: string;
    scrollLabel: string;
    scrollHref: string;
    sceneLabel: string;
    sceneHint: string;
    hintIcon: string;
    pauseLabel: string;
    playLabel: string;
    modeLabel: string;
    specimenPrefix: string;
    fpsLabel: string;
    edition: string;
  };
  platform: {
    id: string;
    index: string;
    eyebrow: string;
    title: string;
    body: string;
    marquee: string[];
    marqueeMark: string;
    stat: string;
    statLabel: string;
  };
  products: {
    id: string;
    index: string;
    countLabel: string;
    eyebrow: string;
    title: string;
    openLabel: string;
    arrow: string;
    docBack: string;
    docEyebrow: string;
    docLinkLabel: string;
    docMissingTitle: string;
    docMissingBody: string;
    items: Product[];
  };
  team: {
    id: string;
    index: string;
    eyebrow: string;
    title: string;
    items: Teammate[];
  };
  contact: {
    id: string;
    index: string;
    eyebrow: string;
    title: string;
    body: string;
    emailLabel: string;
    emailPlaceholder: string;
    submitLabel: string;
    submitIcon: string;
    emptyMessage: string;
    invalidMessage: string;
    successMessage: string;
    directLabel: string;
    email: string;
  };
  footer: {
    copyright: string;
    note: string;
    top: string;
  };
}

function asScene(value: string, index: number): SceneKind {
  if (value === "lattice" || value === "ribbon" || value === "knot") return value;
  throw new Error(
    `content.json products.items[${index}].scene must be lattice, ribbon, or knot`,
  );
}

function requireText(value: string, path: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`content.json is missing text at ${path}`);
  }
}

function loadContent(value: SiteContent): SiteContent {
  requireText(value.meta.title, "meta.title");
  requireText(value.meta.description, "meta.description");
  requireText(value.brand.name, "brand.name");
  requireText(value.hero.titleLead, "hero.titleLead");
  requireText(value.hero.titleAccent, "hero.titleAccent");
  requireText(value.platform.title, "platform.title");
  requireText(value.products.title, "products.title");
  requireText(value.team.title, "team.title");
  requireText(value.contact.title, "contact.title");
  requireText(value.contact.email, "contact.email");

  if (value.navigation.items.length === 0) {
    throw new Error("content.json needs navigation.items");
  }
  if (value.products.items.length === 0) {
    throw new Error("content.json needs products.items");
  }
  if (value.team.items.length === 0) {
    throw new Error("content.json needs team.items");
  }
  if (value.platform.marquee.length === 0) {
    throw new Error("content.json needs platform.marquee");
  }

  value.navigation.items.forEach((item, index) => {
    requireText(item.label, `navigation.items[${index}].label`);
    requireText(item.href, `navigation.items[${index}].href`);
  });

  requireText(value.products.docBack, "products.docBack");
  requireText(value.products.docEyebrow, "products.docEyebrow");
  requireText(value.products.docLinkLabel, "products.docLinkLabel");
  requireText(value.products.docMissingTitle, "products.docMissingTitle");
  requireText(value.products.docMissingBody, "products.docMissingBody");

  const slugs = new Set<string>();
  value.products.items.forEach((item, index) => {
    requireText(item.name, `products.items[${index}].name`);
    requireText(item.category, `products.items[${index}].category`);
    requireText(item.description, `products.items[${index}].description`);
    requireText(item.slug, `products.items[${index}].slug`);
    asScene(item.scene, index);
    if (slugs.has(item.slug)) {
      throw new Error(`content.json reuses the product slug "${item.slug}"`);
    }
    slugs.add(item.slug);
    if (item.docs.length === 0) {
      throw new Error(`content.json products.items[${index}].docs needs at least one section`);
    }
    item.docs.forEach((section, sectionIndex) => {
      const path = `products.items[${index}].docs[${sectionIndex}]`;
      requireText(section.id, `${path}.id`);
      requireText(section.heading, `${path}.heading`);
      if (section.paragraphs.length === 0) {
        throw new Error(`content.json ${path}.paragraphs needs at least one paragraph`);
      }
      section.paragraphs.forEach((paragraph, paragraphIndex) => {
        requireText(paragraph, `${path}.paragraphs[${paragraphIndex}]`);
      });
    });
  });

  value.team.items.forEach((item, index) => {
    requireText(item.name, `team.items[${index}].name`);
    requireText(item.role, `team.items[${index}].role`);
    requireText(item.body, `team.items[${index}].body`);
  });

  return value;
}

export const content = loadContent({
  ...raw,
  products: {
    ...raw.products,
    items: raw.products.items.map((item, index) => ({
      ...item,
      scene: asScene(item.scene, index),
    })),
  },
});
