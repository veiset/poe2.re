import {Button} from "@/components/ui/button.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {
  Eraser,
  Copy,
} from "lucide-react"
import {Accordion, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.tsx";
import {useEffect, useState} from "react";
import {Separator} from "@/components/ui/separator.tsx";
import {Input} from "@/components/ui/input.tsx";
import {loadWebSettings, saveWebSettings} from "@/lib/localStorage.ts";
import {cx} from "class-variance-authority";

export interface ResultProps {
  result: string
  maxLength?: number
  reset: () => void
  customText: string
  setCustomText: (text: string) => void
  autoCopy: boolean
  setAutoCopy: (enable: boolean) => void
}

export function Result(props: ResultProps) {
  const {result, maxLength, reset, customText, setCustomText, autoCopy, setAutoCopy} = props;

  const webSettings = loadWebSettings();
  const currentLength = result.length
  const [showOptions, setShowOptions] = useState(webSettings.optionsOpen);
  const [copied, setCopied] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (autoCopy) {
      navigator.clipboard.writeText(result);
      setCopied(result);
    }
  }, [result, autoCopy]);

  useEffect(() => {
    saveWebSettings({...webSettings, optionsOpen: showOptions})
  }, [showOptions]);

  console.log(copied === result);

  return (
    <>
      <div className="flex">
        <div className="flex-1 font-mono p-4 pt-6">
          <div>
            <p className={cx(
              "text-2xl min-h-12",
              copied === result && "text-green-400"
            )}>
              {result}
            </p>
            <p className="text-sm mt-3 text-gray-400">
              length: {currentLength} / {maxLength ?? 50}
            </p>
          </div>
        </div>
        <div className="flex-none p-4 pb-0">
          <div>
            <Button className="m-1 round bg-green-400 hover:bg-green-600" onClick={() => {
              navigator.clipboard.writeText(result);
              setCopied(result);
            }}>
              <Copy/> Copy
            </Button>
            <Button className="m-1 bg-red-300 hover:bg-red-400" onClick={reset}>
              <Eraser/> Reset
            </Button>
          </div>
          <div className="flex items-center space-x-2 pl-1 pb-4 ">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="mb-0 pb-0" onClick={_ => setShowOptions(!showOptions)}>
                  {showOptions ? "Hide" : "Show"} options
                </AccordionTrigger>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <div className={showOptions ? "p-2 bg-slate-700 flex items-center gap-2 px-4" : "hidden"}>
        <div className="pr-4">Options</div>
        <Separator orientation="vertical" className="mr-2 h-4"/>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms"
                    checked={autoCopy}
                    onCheckedChange={value => setAutoCopy(value as boolean)}
          />
          <label
            htmlFor="terms"
            className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Auto-copy
          </label>
        </div>
        <Separator orientation="vertical" className="mr-2 h-4"/>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="text"
                 placeholder="Custom text"
                 className="font-mono"
                 value={customText}
                 onChange={(e) => setCustomText(e.target.value)}
          />
        </div>
      </div>
    </>
  )
}