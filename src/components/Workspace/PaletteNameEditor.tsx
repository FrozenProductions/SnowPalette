import { FC } from 'react'
import { Pencil } from 'lucide-react'

interface PaletteNameEditorProps {
  isEditing: boolean
  paletteName: string
  onNameChange: (name: string) => void
  onStartEditing: () => void
  onSave: () => void
}

const PaletteNameEditor: FC<PaletteNameEditorProps> = ({
  isEditing,
  paletteName,
  onNameChange,
  onStartEditing,
  onSave,
}) => {
  return isEditing ? (
    <div className="flex items-center">
      <input
        type="text"
        value={paletteName}
        onChange={(e) => onNameChange(e.target.value)}
        className="px-0 h-7 bg-transparent border-none text-xl font-medium focus:outline-none focus:ring-0 caret-primary-300 w-[200px]"
        placeholder="Palette name"
        autoFocus
        onBlur={onSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSave()
          }
        }}
      />
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <h3 className="text-xl font-medium">{paletteName}</h3>
      <button
        onClick={onStartEditing}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <Pencil size={14} />
      </button>
    </div>
  )
}

export default PaletteNameEditor