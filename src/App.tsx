import {
  BrowserRouter, Route, Routes,
} from "react-router-dom";
import {Menu} from "@/components/menu/Menu.tsx";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {useState} from "react";
import {loadWebSettings, saveWebSettings} from "@/lib/localStorage.ts";
import {Vendor} from "@/pages/vendor/Vendor.tsx";
import {Waystone} from "@/pages/waystone/Waystone.tsx";
import {Tablet} from "@/pages/tablet/Tablet.tsx";
import {Relic} from "@/pages/relic/Relic.tsx";

export default function App() {
  const webSettings = loadWebSettings();
  const [sidebarOpen, setSidebarOpen] = useState(webSettings.sidebarOpen);

  return (
    <BrowserRouter>
      <SidebarProvider
        style={{
          // @ts-ignore
          "--sidebar-width": "14rem",
          "--sidebar-width-mobile": "14rem",
        }}
        open={sidebarOpen}
        onOpenChange={(open) => {
          setSidebarOpen(open);
          saveWebSettings({
              ...webSettings,
              sidebarOpen: open,
            }
          )
          localStorage.setItem("sidebarOpen", JSON.stringify(open));
        }}>
        <Menu/>
        <SidebarInset>
          <Routes>
            <Route path="/" element={<Vendor/>}/>
            <Route path="/vendor" element={<Vendor/>}/>
            <Route path="/waystone" element={<Waystone/>}/>
            <Route path="/tablet" element={<Tablet/>}/>
            <Route path="/relic" element={<Relic/>}/>
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  )
}