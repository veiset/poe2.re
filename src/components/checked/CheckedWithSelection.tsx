import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Select} from "../ui/select";
import { CheckedProps } from "./Checked";

export interface CheckedWithSelectionProps extends CheckedProps {
    value: string,
    options: number[],
    onSelected: (change: string) => void,
}

export function CheckedWithSelection(props: CheckedWithSelectionProps) {
  const {id, value, checked, onChange, text, onSelected} = props;

  return (
    <div className="flex items-center p-1 pb-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onChange(checked as boolean)}
        className="h-6 w-6 data-[state=checked]:bg-slate-100 data-[state=unchecked]:bg-gray-950 mr-2"
      />
      <Select className="w-auto" value={value} disabled={!checked} onChange={e => onSelected(e.target.value)}>
        {props.options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </Select>
      <label
        htmlFor={id}
        className="text-md font-light cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-1"
      >
        {text}
      </label>
    </div>
  )
}