import {Checkbox} from "@/components/ui/checkbox.tsx";
import {ReactNode} from "react";
import {cn} from "@/lib/utils.ts";

export interface CheckedProps {
  id: string
  text: string
  checked: boolean
  onChange: (change: boolean) => void
  children?: ReactNode | undefined
}

export function Checked(props: CheckedProps) {
  const {id, text, checked, onChange, children} = props;
  return (
    <div className={cn("flex items-center space-x-2 p-2 pb-2", {"bg-slate-700": checked})}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onChange(checked as boolean)}
        className="h-6 w-6 data-[state=checked]:bg-slate-100 data-[state=unchecked]:bg-gray-950"
      />
      <label
        htmlFor={id}
        className="text-md font-light cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {text}
      </label>
      {children}
    </div>
  )

}