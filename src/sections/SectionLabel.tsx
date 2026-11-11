interface SectionLabelProps {
  index: string;
  label: string;
}

export function SectionLabel({ index, label }: SectionLabelProps) {
  return (
    <p className="chapter-label">
      <span>{index}</span>
      {label}
    </p>
  );
}
