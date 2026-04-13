import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import RegisterMedecin from "./pages/registerMedecin";
import RegisterLabo from "./pages/registerLabo";
import Extraction from "./pages/extraction";
import Patients from "./pages/patient";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/extraction" element={<Extraction />} />
      <Route path="/registerLabo" element={<RegisterLabo />} />
      <Route path="/registerMedecin" element={<RegisterMedecin />} />
      <Route path="/patients" element={<Patients />} />
    </Routes>
  );
}

export default App;
