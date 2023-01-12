import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Page from "./common/components/Page/Page";
import "./App.css";
import Logout from "./pages/Logout/Logout";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
