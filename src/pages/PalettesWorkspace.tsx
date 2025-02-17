import { FC, useState, useEffect, useRef } from 'react'
import { Plus } from 'lucide-react'
import { PaletteIcon } from 'lucide-react'
import Toast from '../components/Toast'
import FolderView from '../components/FolderView'
import { AddColorModal } from '../components/AddColorModal'
import { ColorItem, Folder as FolderType, Palette as PaletteType, ColorCategory } from '../types/colors'
import { Header, PaletteList, PaletteActions, PaletteNameEditor } from '../components/Workspace'
import { generateColorName } from '../utils/colorNaming'
import { useShortcuts } from '../hooks/useShortcuts'

const STORAGE_KEY = 'snowpalette-workspace'
const SELECTED_PALETTE_KEY = 'snowpalette-selected'

const PalettesWorkspace: FC = () => {
  const [showSidebar, setShowSidebar] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [palettes, setPalettes] = useState<PaletteType[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  })
  const [currentPalette, setCurrentPalette] = useState<PaletteType | null>(null)
  const [editingPaletteName, setEditingPaletteName] = useState(false)
  const [paletteName, setPaletteName] = useState('')
  const [showColorInput, setShowColorInput] = useState(false)
  const newColor = "#000000";
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  useEffect(() => {
    const savedPaletteId = localStorage.getItem(SELECTED_PALETTE_KEY)
    if (palettes.length > 0) {
      const paletteToSelect = savedPaletteId 
        ? palettes.find(p => p.id === savedPaletteId) || palettes[palettes.length - 1]
        : palettes[palettes.length - 1]
      
      setCurrentPalette(paletteToSelect)
      setPaletteName(paletteToSelect.name)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes))
  }, [palettes])

  useEffect(() => {
    if (currentPalette) {
      localStorage.setItem(SELECTED_PALETTE_KEY, currentPalette.id)
      setPaletteName(currentPalette.name)
    }
  }, [currentPalette])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setShowSidebar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleUpdateColors = (newColors: ColorItem[]) => {
    if (currentPalette) {
      const updatedPalette = {
        ...currentPalette,
        colors: newColors
      }
      setPalettes(prev => prev.map(p => 
        p.id === currentPalette.id ? updatedPalette : p
      ))
      setCurrentPalette(updatedPalette)
    }
  }

  const handleUpdateFolderName = (folderId: string, name: string) => {
    if (currentPalette) {
      const updatedPalette = {
        ...currentPalette,
        folders: currentPalette.folders.map(f => 
          f.id === folderId ? { ...f, name } : f
        )
      }
      setPalettes(prev => prev.map(p => 
        p.id === currentPalette.id ? updatedPalette : p
      ))
      setCurrentPalette(updatedPalette)
    }
  }

  const handleDeleteFolder = (folderId: string) => {
    if (currentPalette) {
      const updatedColors = currentPalette.colors.map(color => 
        color.folderId === folderId ? { ...color, folderId: null } : color
      )
      const updatedPalette = {
        ...currentPalette,
        folders: currentPalette.folders.filter(f => f.id !== folderId),
        colors: updatedColors
      }
      setPalettes(prev => prev.map(p => 
        p.id === currentPalette.id ? updatedPalette : p
      ))
      setCurrentPalette(updatedPalette)
      showNotification('Folder deleted')
    }
  }

  const handleDeleteColor = (colorId: string) => {
    if (currentPalette) {
      const updatedPalette = {
        ...currentPalette,
        colors: currentPalette.colors.filter(c => c.id !== colorId)
      }
      setPalettes(prev => prev.map(p => 
        p.id === currentPalette.id ? updatedPalette : p
      ))
      setCurrentPalette(updatedPalette)
      showNotification('Color removed from palette')
    }
  }

  const showNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
  }

  const handleNewPalette = () => {
    const newPalette: PaletteType = {
      id: Date.now().toString(),
      name: 'New Palette',
      colors: [],
      folders: []
    }
    setPalettes(prev => [...prev, newPalette])
    setCurrentPalette(newPalette)
    setPaletteName('New Palette')
    showNotification('New palette created')
  }

  const handleNewFolder = () => {
    if (!currentPalette) {
      showNotification("Please select a palette first")
      return
    }

    const newFolder: FolderType = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: "New Folder"
    }

    const updatedPalette = {
      ...currentPalette,
      folders: [...(currentPalette.folders || []), newFolder]
    }

    setPalettes(prev => 
      prev.map(p => p.id === currentPalette.id ? updatedPalette : p)
    )
    setCurrentPalette(updatedPalette)
    showNotification("Folder created")
  }

  const handleDeletePalette = (paletteId: string) => {
    setPalettes(prev => prev.filter(p => p.id !== paletteId))
    if (currentPalette?.id === paletteId) {
      const remainingPalettes = palettes.filter(p => p.id !== paletteId)
      if (remainingPalettes.length > 0) {
        setCurrentPalette(remainingPalettes[remainingPalettes.length - 1])
      } else {
        setCurrentPalette(null)
      }
    }
    showNotification('Palette deleted')
  }

  const handleAddColor = (colors: string[]) => {
    if (currentPalette) {
      const newColorItems: ColorItem[] = colors.map(color => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        value: color,
        category: "other" as ColorCategory,
        name: generateColorName(color),
        folderId: selectedFolderId
      }))

      const updatedPalette: PaletteType = {
        ...currentPalette,
        colors: [...currentPalette.colors, ...newColorItems]
      }
      setPalettes(prev => prev.map(p => 
        p.id === currentPalette.id ? updatedPalette : p
      ))
      setCurrentPalette(updatedPalette)
      showNotification(`${colors.length} color${colors.length > 1 ? "s" : ""} added to ${selectedFolderId ? "folder" : "unorganized"}`)
    }
  }

  const handleExportFolders = () => {
    if (!currentPalette) {
      showNotification("Please select a palette first")
      return
    }
    
    const exportData = {
      folders: currentPalette.folders,
      colors: currentPalette.colors
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentPalette.name.toLowerCase().replace(/\s+/g, "-")}-folders.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showNotification("Folders exported successfully")
  }

  const handleImportFolders = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentPalette || !event.target.files?.length) return

    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string)
        
        if (!importData.folders || !Array.isArray(importData.folders)) {
          throw new Error('Invalid folder data')
        }

        const updatedPalette = {
          ...currentPalette,
          folders: [...currentPalette.folders, ...importData.folders],
          colors: [...currentPalette.colors, ...(importData.colors || [])]
        }

        setPalettes(prev => prev.map(p => 
          p.id === currentPalette.id ? updatedPalette : p
        ))
        setCurrentPalette(updatedPalette)
        showNotification('Folders imported successfully')
      } catch (err) {
        showNotification('Failed to import folders')
      }
    }

    reader.readAsText(file)
    event.target.value = '';
  }

  const handleReorderFolders = (newFolders: FolderType[]) => {
    if (currentPalette) {
      const updatedPalette = {
        ...currentPalette,
        folders: newFolders
      }
      setPalettes(prev => prev.map(p => 
        p.id === currentPalette.id ? updatedPalette : p
      ))
      setCurrentPalette(updatedPalette)
    }
  }

  const shortcuts = useShortcuts({
    "new-palette": {
      key: "n",
      altKey: true,
      description: "Create new palette",
      action: handleNewPalette
    },
    "add-color": {
      key: "c",
      altKey: true,
      description: "Add new color",
      action: () => {
        setShowColorInput(true)
      }
    },
    "toggle-sidebar": {
      key: "b",
      altKey: true,
      description: "Toggle sidebar",
      action: () => setShowSidebar(prev => !prev)
    },
    "export-folders": {
      key: "e",
      altKey: true,
      description: "Export folders",
      action: handleExportFolders
    },
    "rename-palette": {
      key: "r",
      altKey: true,
      description: "Rename palette",
      action: () => {
        setEditingPaletteName(true)
      }
    }
  })

  return (
    <div className="min-h-screen h-screen overflow-hidden bg-dark-900 text-white relative">
      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onHide={() => setShowToast(false)}
      />
      
      <Header 
        onNewPalette={handleNewPalette}
        shortcuts={shortcuts}
      />

      <main className="h-[calc(100vh-5rem)] pt-20">
        <div className="container mx-auto h-full px-4 flex items-center justify-center">
          <div className="bg-dark-800/50 rounded-xl p-6 border border-dark-700 max-w-4xl w-full h-full flex flex-col">
            {currentPalette ? (
              <div className="h-full flex flex-col min-h-0">
                <div className="flex-shrink-0 flex items-center justify-between mb-6">
                  <PaletteNameEditor
                    isEditing={editingPaletteName}
                    paletteName={paletteName}
                    onNameChange={setPaletteName}
                    onStartEditing={() => setEditingPaletteName(true)}
                    onSave={() => {
                      if (currentPalette) {
                        const updatedPalette = {
                          ...currentPalette,
                          name: paletteName
                        }
                        setPalettes(prev => prev.map(p => 
                          p.id === currentPalette.id ? updatedPalette : p
                        ))
                        setCurrentPalette(updatedPalette)
                        setEditingPaletteName(false)
                      }
                    }}
                  />
                  <PaletteActions
                    onAddColor={() => setShowColorInput(true)}
                    onNewFolder={handleNewFolder}
                    onExportFolders={handleExportFolders}
                    onImportFolders={handleImportFolders}
                    onShare={() => showNotification("Share link copied to clipboard")}
                    paletteName={currentPalette.name}
                    colors={currentPalette.colors}
                    folders={currentPalette.folders}
                    selectedFolderId={selectedFolderId}
                  />
                </div>

                <div className="flex-1 min-h-0">
                  <FolderView
                    colors={currentPalette.colors}
                    folders={currentPalette.folders}
                    paletteId={currentPalette.id}
                    onUpdateFolderName={handleUpdateFolderName}
                    onDeleteFolder={handleDeleteFolder}
                    onDeleteColor={handleDeleteColor}
                    onUpdateColors={handleUpdateColors}
                    onFolderSelect={setSelectedFolderId}
                    selectedFolderId={selectedFolderId}
                    onReorderFolders={handleReorderFolders}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <PaletteIcon size={48} className="text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">No Palette Selected</h3>
                <p className="text-sm text-gray-500 mb-6">Create a new palette to get started</p>
                <button
                  onClick={handleNewPalette}
                  className="px-4 py-2 bg-primary/10 text-sm text-primary-300 rounded-xl border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  New Palette
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <PaletteList
        palettes={palettes}
        currentPalette={currentPalette}
        showSidebar={showSidebar}
        onNewPalette={handleNewPalette}
        onSelectPalette={setCurrentPalette}
        onDeletePalette={handleDeletePalette}
        onToggleSidebar={() => setShowSidebar(prev => !prev)}
      />

      <AddColorModal
        isOpen={showColorInput}
        onClose={() => setShowColorInput(false)}
        onAdd={handleAddColor}
        initialColor={newColor}
        selectedFolderId={selectedFolderId}
      />
    </div>
  )
}

export default PalettesWorkspace 