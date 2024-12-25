import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";

export interface HeaderProps {
  name: string
}

export function Header({name}: HeaderProps) {

  return (
    <header
      className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1"/>
        <Separator orientation="vertical" className="mr-2 h-4"/>
        <h1 className="scroll-m-20 text-2xl tracking-tight lg:text-2xl">
          {name}
        </h1>
      </div>
    </header>
  )
}