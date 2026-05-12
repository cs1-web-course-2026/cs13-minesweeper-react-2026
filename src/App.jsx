import ShyshkinSerhii from './pages/ShyshkinSerhii';
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Game from './pages/Game'
import MockGame from './pages/MockGame'
import StudentMinesweeperGame from './pages/IllyaLogvynenko'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="game" element={<Game />} />
        <Route path="/shyshkin-serhii" element={<ShyshkinSerhii />} />
        <Route path="mock-game" element={<MockGame />} />
        <Route path="illya-logvynenko" element={<StudentMinesweeperGame />} />
      </Route>
    </Routes>
  )
}

export default App