import { FC, ChangeEvent } from 'react'
import { Plus, Folder, Download, Upload } from 'lucide-react'
import ActionButton from './ActionButton'

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
      <ActionButton
        onClick={onAddColor}
        icon={<Plus size={14} />}
        label="Add Color"
        tooltip="Add a new color (Alt + C)"
      />
      <ActionButton
        onClick={onNewFolder}
        icon={<Folder size={14} />}
        label="New Folder"
        tooltip="Create a new folder"
      />
      <div className="h-6 w-px bg-dark-600" />
      <ActionButton
        onClick={onExportFolders}
        icon={<Download size={14} />}
        label=""
        tooltip="Export folders and colors as JSON"
      />
      <label className="cursor-pointer">
        <input
          type="file"
          accept=".json"
          onChange={onImportFolders}
          className="hidden"
        />
        <ActionButton
          icon={<Upload size={14} />}
          label=""
          tooltip="Import folders from JSON"
        />
      </label>
    </div>
  )
}

export default PaletteActions 