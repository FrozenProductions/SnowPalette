import { FC } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Workspace from './pages/PalettesWorkspace'
import ShareCapture from './pages/ShareCapture'
import Documentation from './pages/Documentation'
import { KeyboardProvider } from './contexts/KeyboardContext'

const App: FC = () => {
  return (
    <KeyboardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/share/:paletteId/:folderId?" element={<ShareCapture />} />
          <Route path="/docs" element={<Documentation />} />
        </Routes>
      </BrowserRouter>
    </KeyboardProvider>
  )
}

export default App
