export default function StyledSelect({
  name,
  label,
  defaultSelection,
  options,
  className,
  onChange,
}: {
  name: string;
  label: string;
  options: { label: string; value: string }[];
  defaultSelection?: string;
  className?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label
      className={`flex w-full flex-col items-start justify-start ${
        className || ""
      }`}
    >
      <span className="ml-1 text-sm font-bold">{label}</span>
      <select
        name={name}
        className="w-full p-1 border rounded-lg bg-white/90"
        defaultValue={defaultSelection}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
