import raw from "./content.json";

export type SceneKind = "lattice" | "ribbon" | "knot";

export interface NavItem {
  label: string;
  href: string;
}

export interface Product {
  number: string;
  name: string;
  category: string;
  year: string;
  description: string;
  scene: SceneKind;
  color: string;
  secondary: string;
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

  value.products.items.forEach((item, index) => {
    requireText(item.name, `products.items[${index}].name`);
    requireText(item.category, `products.items[${index}].category`);
    requireText(item.description, `products.items[${index}].description`);
    asScene(item.scene, index);
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
