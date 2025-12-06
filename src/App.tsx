import "@/App.css";
import Layout from "@/layout/Layout";
import ControlPanel from "@/pages/ControlPanel/ControlPanel";
import MatugenConfig from "@/pages/MatugenConfig/MatugenConfig";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ControlPanel />} index />
          <Route path="/matugen-config" element={<MatugenConfig />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
