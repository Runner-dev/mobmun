export default function StyledCheckbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-start gap-2">
      <span className="ml-1 text-sm font-bold">{label}</span>
      <input
        autoComplete="off"
        type="checkbox"
        value="true"
        name={name}
        defaultChecked={defaultChecked}
        className="p-1 bg-white border rounded-lg "
      />
    </label>
  );
}
