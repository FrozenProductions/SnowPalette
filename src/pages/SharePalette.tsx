import { FC, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Plus, ArrowLeft, Folder, Loader2 } from "lucide-react"
import { Palette } from "../types/colors"
import { STORAGE_KEY, SELECTED_PALETTE_KEY } from "../constants/storage"
import Toast from "../components/Toast"
import { decodeShareData } from "../utils/share"

const SharePalette: FC = () => {
  const { shareData: encodedData } = useParams()
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isImporting, setIsImporting] = useState(false)

  const shareData = encodedData ? decodeShareData(encodedData) : null

  const showNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
  }

  const handleImport = async () => {
    if (!shareData) return
    setIsImporting(true)

    try {
      const savedData = localStorage.getItem(STORAGE_KEY)
      const selectedPaletteId = localStorage.getItem(SELECTED_PALETTE_KEY)
      
      if (!savedData || !selectedPaletteId) {
        throw new Error("No palette selected")
      }

      const palettes: Palette[] = JSON.parse(savedData)
      const currentPalette = palettes.find(p => p.id === selectedPaletteId)

      if (!currentPalette) {
        throw new Error("Selected palette not found")
      }

      const newFolder = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        name: shareData.folderName || "Imported Colors"
      }

      const newColors = shareData.colors.map(color => ({
        ...color,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        folderId: newFolder.id
      }))

      const updatedPalette = {
        ...currentPalette,
        folders: [...currentPalette.folders, newFolder],
        colors: [...currentPalette.colors, ...newColors]
      }

      const updatedPalettes = palettes.map(p => 
        p.id === currentPalette.id ? updatedPalette : p
      )

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPalettes))
      
      showNotification("Folder imported successfully")
      await new Promise(resolve => setTimeout(resolve, 1500))
      navigate("/workspace", { replace: true })
    } catch (err) {
      console.error("Import error:", err)
      const errorMessage = err instanceof Error && err.message === "No palette selected" 
        ? "Please create or select a palette first" 
        : "Failed to import folder"
      showNotification(errorMessage)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-800 to-dark-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl transform -rotate-12" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="pt-8 pb-4">
          <Link 
            to="/workspace"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Workspace
          </Link>
        </div>

        {shareData ? (
          <div className="max-w-4xl mx-auto py-12">
            <div className="flex flex-col items-center text-center space-y-8 mb-12">
              <div className="w-16 h-16 relative group">
                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-md transition-all group-hover:bg-primary/15 group-hover:blur-lg" />
                <div className="relative bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl p-4 overflow-hidden">
                  <Folder className="w-full h-full text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-500 mb-2">
                  {shareData.folderName || "Unorganized Colors"}
                </h1>
                <p className="text-gray-400">
                  From <span className="text-gray-300">{shareData.name}</span> • {shareData.colors.length} colors
                </p>
              </div>
            </div>

            <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl border border-dark-700 p-8">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {shareData.colors.map(color => (
                  <div
                    key={color.id}
                    className="aspect-square rounded-xl ring-1 ring-dark-600 group relative overflow-hidden"
                  >
                    <div
                      className="w-full h-full"
                      style={{ 
                        backgroundColor: typeof color.value === "string" ? color.value : "transparent",
                        backgroundImage: typeof color.value === "object" 
                          ? `linear-gradient(${color.value.angle}deg, ${color.value.colors.join(", ")})` 
                          : "none"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                      <span className="text-xs font-medium text-white truncate w-full">
                        {color.name}
                      </span>
                      <span className="text-[10px] font-mono text-white/80 truncate w-full">
                        {typeof color.value === "string" ? color.value.toUpperCase() : "Gradient"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="px-6 py-3 bg-primary/10 text-primary-300 rounded-xl border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Import to My Palettes
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-16 h-16 relative mb-6">
              <div className="absolute inset-0 bg-red-500/10 rounded-2xl blur-md" />
              <div className="relative bg-gradient-to-br from-red-400 to-red-600 rounded-2xl p-4">
                <Folder className="w-full h-full text-white" />
              </div>
            </div>
            <h2 className="text-xl font-medium text-gray-300 mb-2">Invalid Share Link</h2>
            <p className="text-gray-400 mb-8">This share link appears to be invalid or has expired.</p>
            <Link
              to="/workspace"
              className="px-6 py-3 bg-dark-700/50 text-gray-300 rounded-xl border border-dark-600 hover:text-white hover:border-primary/50 transition-colors flex items-center gap-2 font-medium"
            >
              <ArrowLeft size={18} />
              Return to Workspace
            </Link>
          </div>
        )}
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onHide={() => setShowToast(false)}
      />
    </main>
  )
}

export default SharePalette 