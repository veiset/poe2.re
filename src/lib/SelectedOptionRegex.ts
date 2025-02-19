import {SelectOption} from "@/components/selectList/SelectList.tsx";
import {generateNumberRegex} from "@/lib/GenerateNumberRegex.ts";

export function selectedOptionRegex(
  option: SelectOption,
  round10: boolean,
  over100: boolean
): string {
  if (option.value) {
    return `${generateNumberRegex(option.value.toString(), round10, over100)}.*${option.regex}`
  } else {
    return option.regex
  }
}
