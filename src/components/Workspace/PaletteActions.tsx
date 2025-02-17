import { FC, ChangeEvent } from 'react'
import { Plus, Folder, Download, Upload } from 'lucide-react'

interface PaletteActionsProps {
  onAddColor: () => void
  onNewFolder: () => void
  onExportFolders: () => void
  onImportFolders: (event: ChangeEvent<HTMLInputElement>) => void
}

const PaletteActions: FC<PaletteActionsProps> = ({
  onAddColor,
  onNewFolder,
  onExportFolders,
  onImportFolders,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onAddColor}
        className="h-8 px-3 bg-dark-700/50 text-sm text-gray-300 rounded-lg border border-dark-600 hover:border-primary/50 transition-colors flex items-center gap-1.5"
      >
        <Plus size={14} />
        Add Color
      </button>
      <button
        onClick={onNewFolder}
        className="h-8 px-3 bg-dark-700/50 text-sm text-gray-300 rounded-lg border border-dark-600 hover:border-primary/50 transition-colors flex items-center gap-1.5"
      >
        <Folder size={14} />
        New Folder
      </button>
      <div className="h-6 w-px bg-dark-600" />
      <button
        onClick={onExportFolders}
        className="h-8 px-3 bg-dark-700/50 text-sm text-gray-300 rounded-lg border border-dark-600 hover:border-primary/50 transition-colors flex items-center gap-1.5"
        title="Export folders"
      >
        <Download size={14} />
      </button>
      <label className="cursor-pointer">
        <input
          type="file"
          accept=".json"
          onChange={onImportFolders}
          className="hidden"
        />
        <div
          className="h-8 px-3 bg-dark-700/50 text-sm text-gray-300 rounded-lg border border-dark-600 hover:border-primary/50 transition-colors flex items-center gap-1.5"
          title="Import folders"
        >
          <Upload size={14} />
        </div>
      </label>
    </div>
  )
}

export default PaletteActions 