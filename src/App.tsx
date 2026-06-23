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
import {Item} from "@/pages/item/Item.tsx";
import {GlobalErrorBoundary} from "@/components/error/GlobalErrorBoundary.tsx";
import {useRefreshFromInitialLoad, useRefreshOnFocus} from "@/lib/RefreshOnFocus.ts";

export default function App() {
  const webSettings = loadWebSettings();
  const [sidebarOpen, setSidebarOpen] = useState(webSettings.sidebarOpen);

  useRefreshFromInitialLoad();
  useRefreshOnFocus();

  return (
    <GlobalErrorBoundary>
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
            <Route path="/item" element={<Item/>}/>
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
    </GlobalErrorBoundary>
  )
}