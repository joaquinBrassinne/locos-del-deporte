import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClubesPage from './pages/ClubesPage/ClubesPage';
import DeportistasPage from './pages/DeportistasPage/DeportistasPage';
function App() {
  return (
    <BrowserRouter>
 
      <Routes>
        <Route path="/" element={<ClubesPage />} />
        <Route path="/clubes" element={<ClubesPage />} />
        <Route path="/deportistas" element={<DeportistasPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;