import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Game from './pages/Game'
import MockGame from './pages/MockGame'
import KlushynMaksymGame from './pages/KlushynMaksym';
import ZhukYaroslavGame from './pages/ZhukYaroslav';
import StudentMinesweeperGame from './pages/SheveliaViktoriia'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="game" element={<Game />} />
        <Route path="mock-game" element={<MockGame />} />
        <Route path="klushyn-maksym" element={<KlushynMaksymGame />} />
        <Route path="/zhuk-yaroslav" element={<ZhukYaroslavGame />} />
        <Route path="shevelia-viktoriia" element={<StudentMinesweeperGame />} />
      </Route>
    </Routes>
  )
}

export default App