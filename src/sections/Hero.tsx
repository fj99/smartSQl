import { useState, type CSSProperties } from "react";
import { content, type Product } from "../content";
import { ParticleField } from "../scene/ParticleField";

interface HeroProps {
  product: Product;
  active: number;
  onSelect: (index: number) => void;
}

export function Hero({ product, active, onSelect }: HeroProps) {
  const { hero, products } = content;
  const [paused, setPaused] = useState(false);

  return (
    <section className="stage" id="top" style={{ "--accent": product.color } as CSSProperties}>
      <div className="stage-copy">
        <p className="eyebrow">
          <span>{hero.spark}</span>
          {hero.eyebrow}
        </p>
        <h1 className="display">
          <span>{hero.titleLead}</span>
          <em>{hero.titleAccent}</em>
        </h1>
        <p className="stage-body">{hero.body}</p>
        <a className="pill" href={hero.ctaHref}>
          {hero.cta}
          <span aria-hidden="true">{hero.ctaIcon}</span>
        </a>
      </div>

      <div className="specimen">
        <ParticleField
          scene={product.scene}
          color={product.color}
          secondary={product.secondary}
          paused={paused}
          label={hero.sceneLabel}
        />
        <div className="specimen-corners" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <p className="specimen-meta">
          <span>
            {hero.specimenPrefix} {product.number}
          </span>
          <span>{hero.fpsLabel}</span>
        </p>
        <p className="specimen-hint">
          <span aria-hidden="true">{hero.hintIcon}</span>
          {hero.sceneHint}
        </p>
        <button
          type="button"
          className="motion-toggle"
          aria-pressed={paused}
          aria-label={paused ? hero.playLabel : hero.pauseLabel}
          onClick={() => setPaused((value) => !value)}
        >
          <span className={paused ? "icon-play" : "icon-pause"} aria-hidden="true" />
        </button>
      </div>

      <div className="rail">
        <p>{hero.modeLabel}</p>
        <div className="rail-list" role="group" aria-label={hero.modeLabel}>
          {products.items.map((item, index) => (
            <button
              key={item.number}
              type="button"
              className={index === active ? "is-active" : undefined}
              aria-pressed={index === active}
              onClick={() => onSelect(index)}
            >
              <span>{item.number}</span>
              <strong>{item.name}</strong>
              <i style={{ color: item.color }} aria-hidden="true" />
            </button>
          ))}
        </div>
        <p className="rail-note">{product.description}</p>
      </div>

      <p className="edition">{hero.edition}</p>
      <a className="scroll-cue" href={hero.scrollHref}>
        <i aria-hidden="true" />
        {hero.scrollLabel}
      </a>
    </section>
  );
}
