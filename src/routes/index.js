import { Routes, Route } from "react-router-dom";
import Home from '../pages/home';
import Jogos from '../pages/jogos';
import RomaGame from '../pages/homeGame';
function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jogos" element={<Jogos />} />
      <Route path="/homegame" element={<RomaGame />} />
    </Routes>
  );
}
export default RoutesApp;
