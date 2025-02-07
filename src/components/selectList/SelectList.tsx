import {Input} from "@/components/ui/input.tsx";
import {useEffect, useState} from "react";
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
  selectOption: SelectOption
  select: (option: SelectOption) => void
}

export function SelectElement(props: SelectElementProps) {
  const {name, ranges, selectOption, select} = props;
  const hasRange = name.startsWith("##%") && ranges.length > 0;
  const displayName = name.replace(/##/, "").replace(/##/g, "#").replace(/\|/g, " • ");

  return (
    <div className={cn("flex w-full max-w items-center space-x-2 p-1", {"bg-slate-700": selectOption.isSelected})}>
      {hasRange &&
          <Input
              className="pl-2 mt-0 mb-0 h-8 w-20 bg"
              type="text"
              placeholder={ranges[0][0] + "-" + ranges[0][1]}
              value={selectOption.value as number || undefined}
              onChange={(e) => {
                select({...selectOption, value: Number(e.target.value), isSelected: true})
              }}
          />
      }
      <div className="cursor-pointer" onClick={() => select({...selectOption, isSelected: !selectOption.isSelected})}>
        {displayName}
      </div>
    </div>
  )
}

export interface SelectListProps {
  id: string
  options: SelectOption[]
  onUpdate: (options: SelectOption[]) => void
}

export function SelectList(props: SelectListProps
) {
  const {id, options, onUpdate} = props;
  const [selected, setSelected] = useState<SelectOption[]>(options);

  useEffect(() => {
    onUpdate(selected);
  }, [selected]);

  return (
    <div key={id}>
      {options.map((mod) => {
        const option = selected.find((e) => e.name === mod.name) as SelectOption;
        return (
          <SelectElement
            key={mod.name}
            ranges={mod.ranges}
            name={mod.name}
            selectOption={option}
            select={(option) => {
              setSelected(selected
                .filter((e) => e.name !== option.name)
                .concat(option))
            }}
          />
        )
      })}
    </div>
  )
}
