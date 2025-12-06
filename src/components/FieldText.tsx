type FieldTextProps = {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
};

export default function FieldText({
  label,
  onChange,
  value,
  name,
}: FieldTextProps) {
  return (
    <label
      className="flex h-12 cursor-pointer items-center justify-between rounded-lg bg-transparent px-3.5 py-3 duration-100 select-none hover:bg-(--surface-hover)/60"
      form="name"
    >
      <span>{label}</span>

      <input
        className="rounded-md bg-[color-mix(in_srgb,var(--surface),var(--text)_10%)] px-1.5 py-1"
        type="text"
        name={name}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
