import { Routes, Route } from "react-router-dom";
import Home from '../pages/home';
import Jogos from '../pages/jogos';
function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jogos" element={<Jogos />} />
    </Routes>
  );
}
export default RoutesApp;
