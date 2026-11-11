import { content } from "../content";
import { SectionLabel } from "./SectionLabel";

export function PointOfView() {
  const { platform } = content;
  const copies = [0, 1, 2, 3];

  return (
    <section className="chapter chapter-bone" id={platform.id}>
      <SectionLabel index={platform.index} label={platform.eyebrow} />
      <div className="statement">
        <div>
          <h2>{platform.title}</h2>
          <p>{platform.body}</p>
        </div>
        <p className="stat-block">
          <strong>{platform.stat}</strong>
          <span>{platform.statLabel}</span>
        </p>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {copies.map((copy) => (
            <span className="marquee-group" key={copy} aria-hidden={copy > 0 ? true : undefined}>
              {platform.marquee.map((phrase) => (
                <span key={`${copy}-${phrase}`}>
                  {phrase}
                  <i aria-hidden="true">{platform.marqueeMark}</i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
