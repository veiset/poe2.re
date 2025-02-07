import {Input} from "@/components/ui/input.tsx";
import {cn} from "@/lib/utils.ts";

export interface SelectOption {
  name: string
  value: number | null
  isSelected: boolean
  ranges: number[][]
  regex: string
}

interface SelectElementProps {
  name: string
  ranges: number[][]
  current: SelectOption
  selected: SelectOption[]
  setSelected: (options: SelectOption[]) => void
}

export function SelectElement(props: SelectElementProps) {
  const {name, ranges, current, selected, setSelected} = props;
  const hasRange = name.startsWith("##%") && ranges.length > 0 && ranges[0][0] > 0;
  const displayName = name
    .replace(/\|/g, " • ");

  return (
    <div className={cn("flex w-full max-w items-center space-x-2 p-1", {"bg-slate-700": current.isSelected})}>
      {hasRange &&
          <Input
              className="pl-2 mt-0 mb-0 h-8 w-20 bg"
              type="text"
              placeholder={ranges[0][0] + "-" + ranges[0][1]}
              value={current.value as number || ""}
              onChange={(e) => {
                setSelected(selected
                  .filter((e) => e.name !== name)
                  .concat({...current, value: Number(e.target.value), isSelected: true}))
              }}
          />
      }
      <div className="cursor-pointer" onClick={() =>
        setSelected(selected
          .filter((e) => e.name !== name)
          .concat({...current, isSelected: !current.isSelected}))
      }>
        {hasRange && displayName.replace(/##/, "")}
        {!hasRange && displayName.replace(/##/g, "#")}
      </div>
    </div>
  )
}

export interface SelectListProps {
  id: string
  options: SelectOption[]
  selected: SelectOption[]
  setSelected: (options: SelectOption[]) => void
}

export function SelectList(props: SelectListProps
) {
  const {id, options, selected, setSelected} = props;

  return (
    <div key={id}>
      {options.map((mod) => {
        return (
          <div key={mod.name}>
            <SelectElement
              current={selected.find((e) => e.name === mod.name) as SelectOption || mod}
              ranges={mod.ranges}
              name={mod.name}
              selected={selected}
              setSelected={setSelected}
            />
          </div>
        )
      })}
    </div>
  )
}
