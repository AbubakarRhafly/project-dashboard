import { useState } from "react";
import "./App.css";
import Login from "./pages/login.jsx";
import Admin from "./pages/admin.jsx";

export default function App() {
  const [isAuthed, setIsAuthed] = useState(false);

  const handleLogin = ({ email, password }) => {
    setIsAuthed(true);
  };

  return isAuthed ? <Admin /> : <Login onLogin={handleLogin} />;
}
