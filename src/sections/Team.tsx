import { content } from "../content";
import { SectionLabel } from "./SectionLabel";

export function Team() {
  const { team } = content;

  return (
    <section className="chapter chapter-lime" id={team.id}>
      <SectionLabel index={team.index} label={team.eyebrow} />
      <div className="roster-head">
        <h2>{team.title}</h2>
        <div className="orbit" aria-hidden="true">
          <span />
          <i />
        </div>
      </div>
      <div className="roster-list">
        {team.items.map((person) => (
          <article key={person.number}>
            <span>{person.number}</span>
            <h3>{person.name}</h3>
            <p className="role">{person.role}</p>
            <p>{person.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
