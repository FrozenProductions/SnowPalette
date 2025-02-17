import { FC } from "react"

type ActionButtonProps = {
  onClick?: () => void
  icon: JSX.Element
  label: string
  tooltip: string
  className?: string
}

const ActionButton: FC<ActionButtonProps> = ({ onClick, icon, label, tooltip, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative h-8 px-3 bg-dark-700/50 text-sm text-gray-300 rounded-lg border border-dark-600 hover:border-primary/50 hover:bg-dark-600/50 transition-all flex items-center gap-1.5 ${className}`}
    >
      {icon}
      {label && <span>{label}</span>}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-800 text-xs text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-dark-600 pointer-events-none">
        {tooltip}
      </div>
    </button>
  )
}

export default ActionButton 