import { FC } from 'react'

type PaletteNameEditorProps = {
  isEditing: boolean
  paletteName: string
  onNameChange: (name: string) => void
  onStartEditing: () => void
  onSave: () => void
}

const MAX_NAME_LENGTH = 18

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
        onChange={(e) => {
          if (e.target.value.length <= MAX_NAME_LENGTH) {
            onNameChange(e.target.value)
          }
        }}
        className="px-0 h-7 bg-transparent border-none text-xl font-medium focus:outline-none focus:ring-0 caret-primary-300 w-[160px]"
        placeholder="Palette name"
        maxLength={MAX_NAME_LENGTH}
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
    <button
      onClick={onStartEditing}
      className="group relative text-xl font-medium hover:text-primary-300 transition-colors"
    >
      <span>{paletteName}</span>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-800 text-xs text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-dark-600 pointer-events-none z-50">
        Click to rename
      </div>
    </button>
  )
}

export default PaletteNameEditor