import ZhukYaroslavGame from './pages/ZhukYaroslav';
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Game from './pages/Game'
import MockGame from './pages/MockGame' // <--- ОСЬ ЦЕЙ РЯДОК БУВ ПРОПУЩЕНИЙ

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/zhuk-yaroslav" element={<ZhukYaroslavGame />} />
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="game" element={<Game />} />
        <Route path="mock-game" element={<MockGame />} />
      </Route>
    </Routes>
  )
}

export default App