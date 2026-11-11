import { useState, type FormEvent } from "react";
import { content } from "../content";
import { SectionLabel } from "./SectionLabel";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const { contact } = content;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setInvalid(true);
      setMessage(contact.emptyMessage);
      return;
    }
    if (!emailPattern.test(value)) {
      setInvalid(true);
      setMessage(contact.invalidMessage);
      return;
    }
    setInvalid(false);
    setMessage(contact.successMessage);
  }

  return (
    <section className="chapter chapter-violet" id={contact.id}>
      <SectionLabel index={contact.index} label={contact.eyebrow} />
      <div className="signal">
        <div>
          <h2>
            <span>{contact.title}</span>
          </h2>
          <p>{contact.body}</p>
        </div>
        <form onSubmit={onSubmit} noValidate>
          <label htmlFor="access-email">{contact.emailLabel}</label>
          <div className="signal-row">
            <input
              id="access-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={contact.emailPlaceholder}
              value={email}
              aria-invalid={invalid}
              aria-describedby="access-status"
              onChange={(event) => setEmail(event.target.value)}
            />
            <button type="submit">
              {contact.submitLabel}
              <span aria-hidden="true">{contact.submitIcon}</span>
            </button>
          </div>
          <p id="access-status" role="status">
            {message}
          </p>
        </form>
      </div>
      <div className="direct">
        <span>{contact.directLabel}</span>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </div>
    </section>
  );
}
