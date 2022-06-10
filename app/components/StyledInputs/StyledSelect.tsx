export default function StyledSelect({
  name,
  label,
  defaultSelection,
  options,
}: {
  name: string;
  label: string;
  options: { label: string; value: string }[];
  defaultSelection?: string;
}) {
  return (
    <label className="flex flex-col items-start justify-start w-full">
      <span className="ml-1 text-sm font-bold">{label}</span>
      <select
        name={name}
        className="w-full p-1 bg-white border rounded-lg"
        defaultValue={defaultSelection}
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
