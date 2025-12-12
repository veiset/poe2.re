import {Plus, Edit, X} from "lucide-react";
import {useEffect, useState} from "react";
import {loadProfileNames, loadSettings, saveSettings, deleteProfile, setSelectedProfile} from "@/lib/localStorage.ts";
import {Button} from "@/components/ui/button.tsx";

interface Props {
  currentProfile: string;
  setCurrentProfile: (p: string) => void;
  className?: string;
}

export function ProfileSelector({currentProfile, setCurrentProfile, className}: Props) {
  const [profiles, setProfiles] = useState<string[]>(() => loadProfileNames());
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalName, setModalName] = useState('');
  const [modalWarning, setModalWarning] = useState('');

  useEffect(() => {
    setProfiles(loadProfileNames());
  }, [showProfileModal]);

  useEffect(() => {
    // Keep global selected profile in sync
    setSelectedProfile(currentProfile);
  }, [currentProfile]);

  const handleAddProfile = () => {
    setModalMode('add');
    setModalName('');
    setModalWarning('');
    setShowProfileModal(true);
  }

  const handleEditProfile = () => {
    setModalMode('edit');
    setModalName(currentProfile);
    setModalWarning('');
    setShowProfileModal(true);
  }

  const handleModalSave = () => {
    const trimmed = modalName.trim();
    if (!trimmed) {
      setModalWarning('Enter profile name');
      return;
    }
    const existing = loadProfileNames();
    if (modalMode === 'add') {
      if (existing.includes(trimmed)) {
        setModalWarning('Profile with that name already exists');
        return;
      }
      const newSettings = {...loadSettings(currentProfile), name: trimmed};
      saveSettings(newSettings);
      setProfiles(loadProfileNames());
      setCurrentProfile(trimmed);
      setShowProfileModal(false);
      return;
    }

    // edit (rename)
    if (trimmed === currentProfile) {
      setShowProfileModal(false);
      return;
    }
    if (existing.includes(trimmed)) {
      setModalWarning('Profile with that name already exists');
      return;
    }
    const currentSettings = loadSettings(currentProfile);
    const newSettings = {...currentSettings, name: trimmed};
    saveSettings(newSettings);
    deleteProfile(currentProfile);
    setProfiles(loadProfileNames());
    setCurrentProfile(trimmed);
    setShowProfileModal(false);
  }

  const handleDeleteProfile = () => {
    if (currentProfile === "default") {
      alert("Cannot delete default profile");
      return;
    }
    if (!window.confirm(`Delete profile '${currentProfile}'?`)) return;
    deleteProfile(currentProfile);
    const names = loadProfileNames();
    setProfiles(names);
    const next = names.includes("default") ? "default" : (names[0] ?? "default");
    setCurrentProfile(next);
  }

  return (
    <div className={className}>
      <div className="profile-container flex items-center gap-3">
        <div className="text-white">Profile:</div>
        <select value={currentProfile} onChange={(e) => setCurrentProfile(e.target.value)} className="dropdown-select dropdown-md text-white w-44 px-2 py-1 rounded font-small" style={{backgroundColor: 'hsl(var(--muted))'}}>
          {profiles.map((p) => <option className="option-league" key={p} value={p}>{p}</option>)}
        </select>
        <button type="button" aria-label="Add profile" onClick={handleAddProfile} className="flex items-center justify-center text-white p-1">
          <Plus strokeWidth={1.5}/>
        </button>
        <button type="button" aria-label="Edit profile" onClick={handleEditProfile} className="flex items-center justify-center text-white p-1">
          <Edit strokeWidth={1.5}/>
        </button>
        <button type="button" aria-label="Delete profile" onClick={handleDeleteProfile} className="flex items-center justify-center text-white p-1">
          <X strokeWidth={1.5}/>
        </button>

        {showProfileModal && (
          <div
            className="absolute z-50 rounded-md p-2 shadow"
            style={{
              top: '60px',
              right: '40px',
              backgroundColor: 'hsl(var(--border))',
              border: '1px solid hsl(var(--color-text-highlight))'
            }}
          >
            <div className="font-semibold mb-2">{modalMode === 'add' ? 'Create new profile' : 'Rename profile'}</div>
            <div className="profile-input-area flex items-center gap-2 mb-2">
              <label className="text-sm">Profile name:</label>
              <input
                type="text"
                value={modalName}
                onChange={(e) => { setModalName(e.target.value); setModalWarning(''); }}
                className="bg-[#444e5b] border border-black rounded px-3 py-2 w-40 text-white"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex gap-2 mb-2">
                <Button className="m-1 round bg-green-400 hover:bg-green-600" disabled={!modalName.trim()} onClick={handleModalSave}>
                  Save
                </Button>
                <Button className="m-1 bg-red-300 hover:bg-red-400" onClick={() => { setShowProfileModal(false); setModalWarning(''); }}>
                  Cancel
                </Button>
              </div>
              <div style={{color: 'hsl(var(--color-text-warn))'}} className="text-sm">{modalWarning || (!modalName.trim() ? 'Enter profile name' : '')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileSelector;
