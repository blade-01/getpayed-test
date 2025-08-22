import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";

type Option = { label: string; value: string };

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  emptyLabel?: string;
}

export default function SelectDropdown({
  value,
  onChange,
  options,
  className = "",
  emptyLabel = "All"
}: Props) {
  return (
    <Dropdown
      value={value}
      options={options}
      optionLabel="label"
      optionValue="value"
      onChange={(e: DropdownChangeEvent) => onChange(e.value ?? "")}
      className={`input-style ${className}`}
      placeholder={emptyLabel}
      valueTemplate={(option, props) => {
        const label =
          option?.label ??
          (props.value === "" ? emptyLabel : props.placeholder ?? "");
        return <span className="capitalize">{label}</span>;
      }}
      pt={{
        item: { className: "p-2 capitalize" },
        clearIcon: { className: "-mt-2" }
      }}
    />
  );
}
