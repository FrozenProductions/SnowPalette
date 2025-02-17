import { FC, ChangeEvent } from 'react'
import { Plus, Folder, Download, Upload } from 'lucide-react'
import ActionButton from './ActionButton'

type PaletteActionsProps = {
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
    <div className="flex items-center gap-1.5 sm:gap-2">
      <ActionButton
        onClick={onAddColor}
        icon={<Plus size={14} />}
        label="Add Color"
        className="sm:min-w-[100px]"
        showLabelOnMobile={false}
      />
      <ActionButton
        onClick={onNewFolder}
        icon={<Folder size={14} />}
        label="New Folder"
        className="sm:min-w-[100px]"
        showLabelOnMobile={false}
      />
      <div className="hidden sm:block h-6 w-px bg-dark-600" />
      <ActionButton
        onClick={onExportFolders}
        icon={<Download size={14} />}
        label=""
        tooltip="Export folders and colors as JSON"
        className="min-w-0"
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
          className="min-w-0"
        />
      </label>
    </div>
  )
}

export default PaletteActions 