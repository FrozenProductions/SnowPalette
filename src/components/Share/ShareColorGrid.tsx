import { FC } from 'react'
import { motion } from 'framer-motion'
import { ShareColorGridProps } from '../../types/share'

const ShareColorGrid: FC<ShareColorGridProps> = ({ colors, colorsPerRow }) => {
  const getColorRows = () => {
    const rows = []
    for (let i = 0; i < colors.length; i += colorsPerRow) {
      rows.push(colors.slice(i, i + colorsPerRow))
    }
    return rows
  }

  return (
    <div className="flex flex-col gap-4">
      {getColorRows().map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-6 gap-4">
          {row.map((color) => (
            <motion.div
              key={color.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="aspect-square w-full rounded-xl ring-1 ring-white/5 relative overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{ 
                    backgroundColor: typeof color.value === 'string' ? color.value : 'transparent',
                    backgroundImage: typeof color.value === 'object' 
                      ? `linear-gradient(${color.value.angle}deg, ${color.value.colors.join(', ')})` 
                      : 'none'
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="text-xs font-medium text-white text-center">
                    {color.name}
                  </div>
                  <div className="text-[10px] font-mono text-white text-center mt-1">
                    {typeof color.value === 'string' ? color.value.toUpperCase() : 'Gradient'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ShareColorGrid 