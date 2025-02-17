import { FC } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { ShareHeaderProps } from '../../types/share'

const ShareHeader: FC<ShareHeaderProps> = ({ onClose }) => {
  return (
    <header className="sticky top-0 left-0 right-0 h-20 z-50 bg-dark-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/workspace" className="flex items-center gap-3 group">
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-lg blur-sm transition-all group-hover:bg-primary/15" />
            <div className="relative bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg overflow-hidden">
              <img 
                src="/icon-maskable.png" 
                alt="SnowPalette Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-500">
              SnowPalette
            </h1>
            <span className="text-xs text-gray-400">Share Colors</span>
          </div>
        </Link>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-700/50 transition-colors ml-auto"
        >
          <X size={18} />
        </button>
      </div>
    </header>
  )
}

export default ShareHeader 