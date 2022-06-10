export default function StyledInput({
  name,
  label,
  placeholder,
  defaultValue,
}: {
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col">
      <span className="ml-1 text-sm font-bold">{label}</span>
      <input
        autoComplete="off"
        type="text"
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full p-1 bg-white border rounded-lg"
      />
    </label>
  );
}
