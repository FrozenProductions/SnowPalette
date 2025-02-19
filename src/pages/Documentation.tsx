import { FC } from "react"
import { Link } from "react-router-dom"
import { Book, Palette, Keyboard, Share2, Database, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { DocSection } from "../types/documentation"

const sections: DocSection[] = [
  {
    title: "Color Management",
    icon: <Palette className="w-5 h-5" />,
    items: [
      {
        title: "Adding Colors",
        description: "Add colors using HEX, RGB, or HSL values. Upload images to extract colors automatically. Paste multiple colors at once. Use Alt + C for quick access."
      },
      {
        title: "Organizing",
        description: "Create folders to organize colors, drag and drop to rearrange, and filter by categories. Sort your colors by dragging them into your preferred order. Auto-name colors for better organization."
      },
      {
        title: "Selection",
        description: "Select multiple colors to perform batch operations. Use the context menu to select/unselect all colors in a folder."
      }
    ]
  },
  {
    title: "Keyboard Controls",
    icon: <Keyboard className="w-5 h-5" />,
    items: [
      {
        title: "Palette Navigation",
        description: "Alt + ↑/↓: Navigate between palettes, Alt + N: New palette, Alt + R: Rename palette, Alt + B: Toggle sidebar"
      },
      {
        title: "Color & Folder Actions",
        description: "Alt + C: Add color, Click to copy color values, Use folder context menu for batch operations like auto-naming colors"
      }
    ]
  },
  {
    title: "Sharing",
    icon: <Share2 className="w-5 h-5" />,
    items: [
      {
        title: "Export Options",
        description: "Export your palettes as JSON files, share folders as beautiful images, or copy individual/multiple color values"
      },
      {
        title: "Folder Sharing",
        description: "Share specific folders with others, export and import folder structures with their colors"
      }
    ]
  },
  {
    title: "Storage",
    icon: <Database className="w-5 h-5" />,
    items: [
      {
        title: "Local Storage",
        description: "Your palettes are automatically saved locally. Changes are saved instantly."
      },
      {
        title: "Organization",
        description: "Reorder palettes and folders by dragging, move folders between palettes, create folder hierarchies for better organization."
      }
    ]
  }
]

const Documentation: FC = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen overflow-hidden bg-gradient-to-b from-dark-800 to-dark-900 relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl transform -rotate-12" />
      </div>

      <div className="h-full flex flex-col container max-w-5xl mx-auto px-4 py-3 relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3 group flex-shrink-0"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-3 mb-3 flex-shrink-0"
        >
          <div className="w-12 h-12 relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-xl blur-md transition-all group-hover:bg-primary/15 group-hover:blur-lg" />
            <div className="relative bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl p-1 overflow-hidden">
              <Book className="w-full h-full text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-500">
              Documentation
            </h1>
            <p className="text-sm text-gray-400">
              Learn how to use SnowPalette effectively
            </p>
          </div>
        </motion.div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-2 -mr-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
            {sections.map((section, index) => {
              const getColSpan = () => {
                switch (section.title) {
                  case "Color Management":
                    return "md:col-span-8"
                  case "Keyboard Controls":
                    return "md:col-span-4"
                  case "Sharing":
                    return "md:col-span-6"
                  case "Storage":
                    return "md:col-span-6"
                  default:
                    return "md:col-span-6"
                }
              }

              const getRowPosition = () => {
                switch (section.title) {
                  case "Color Management":
                  case "Keyboard Controls":
                    return ""
                  default:
                    return "md:row-start-2"
                }
              }

              return (
                <motion.div 
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4,
                    delay: 0.2 + index * 0.1,
                    ease: "easeOut"
                  }}
                  className={`bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl py-6 px-4 hover:border-primary/20 transition-colors ${getColSpan()} ${getRowPosition()}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary-300">
                      {section.icon}
                    </div>
                    <h2 className="text-lg font-medium text-gray-200">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <div key={item.title}>
                        <h3 className="text-sm font-medium text-gray-300 mb-0.5">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400 leading-snug">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.main>
  )
}

export default Documentation 