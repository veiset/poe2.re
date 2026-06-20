import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {defaultSettings, Settings} from "@/app/settings.ts";
import {useEffect, useState} from "react";
import {loadSettings, saveSettings, selectedProfile, setSelectedProfile} from "@/lib/localStorage.ts";
import ProfileSelector from "@/components/profile/ProfileSelector.tsx";
import {generateMagicItemRegex} from "@/pages/item/ItemResult.ts";


export function Item() {
  const initialProfile = selectedProfile();
  const [currentProfile, setCurrentProfile] = useState<string>(initialProfile);
  const globalSettings = loadSettings(initialProfile)
  const [settings, setSettings] = useState<Settings["item"]>(globalSettings.item);
  const [result, setResult] = useState("");

  useEffect(() => {
    const base = loadSettings(currentProfile);
    const settingsResult = {...base, item: {...settings}, name: currentProfile};
    saveSettings(settingsResult);
    setResult(generateMagicItemRegex(settingsResult.item));
  }, [settings]);

  useEffect(() => {
    const gs = loadSettings(currentProfile);
    setSettings(gs.item);
    setResult(generateMagicItemRegex(gs.item));
    setSelectedProfile(currentProfile);
  }, [currentProfile]);

  return (
    <>
      <div className="flex items-center justify-between">
        <Header name="Item Regex"></Header>
        <div className="page-header-profile pr-4">
          <ProfileSelector currentProfile={currentProfile} setCurrentProfile={setCurrentProfile} />
        </div>
      </div>
      <div className="flex bg-muted grow-0 flex-1 flex-col gap-2 ">
        <Result
          result={result}
          reset={() => setSettings(defaultSettings.item)}
          customText={""} // TODO: Add resultSettings to ItemSettings if needed
          autoCopy={false}
          setCustomText={() => {}}
          setAutoCopy={() => {}}
        />
      </div>
      <div className="p-4">
        <p>Item page scaffolding. Content to be added.</p>
      </div>
    </>
  );
}
