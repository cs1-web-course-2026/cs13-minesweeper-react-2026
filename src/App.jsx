import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Game from './pages/Game'
import MockGame from './pages/MockGame'
import ZhukYaroslavGame from './pages/ZhukYaroslav';
import StudentMinesweeperGame from './pages/SheveliaViktoriia'
import BoikoVlad from "./pages/BoikoVlad";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="game" element={<Game />} />
        <Route path="mock-game" element={<MockGame />} />
        <Route path="/zhuk-yaroslav" element={<ZhukYaroslavGame />} />
        <Route path="shevelia-viktoriia" element={<StudentMinesweeperGame />} />
        <Route path="/boiko-vlad" element={<BoikoVlad />} />
      </Route>
    </Routes>
  )
}

export default App