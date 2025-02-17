import { FC } from 'react'
import { ShareInfoProps } from '../../types/share'

const ShareInfo: FC<ShareInfoProps> = ({ paletteName, folderName, colorsCount }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 relative">
          <div className="absolute inset-0 bg-primary/10 rounded-lg blur-sm" />
          <div className="relative bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg overflow-hidden">
            <img 
              src="/icon-maskable.png" 
              alt="SnowPalette Logo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h4 className="text-lg font-medium text-gray-200">{paletteName}</h4>
          <span className="text-sm text-gray-400">{folderName || 'Unorganized Colors'}</span>
        </div>
      </div>
      <div className="text-sm text-gray-400 font-medium">
        {colorsCount} colors
      </div>
    </div>
  )
}

export default ShareInfo 