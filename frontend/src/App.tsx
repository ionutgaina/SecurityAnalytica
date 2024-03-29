import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Page from "./common/components/Page/Page";
import "./App.css";
import Logout from "./pages/Logout/Logout";
import { Profile } from "./pages/Profile/Profile";
import { SearchUser } from "./pages/SearchUser/SearchUser";
import { hasToken } from "./common/api/auth";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search_user" element={<SearchUser/>} />
          <Route path="*" element={<Page><h1>404 - Not Found</h1></Page>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
