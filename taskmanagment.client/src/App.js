import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar"; // Assuming 'your-navbar-library' is the library name
import Home from "./pages/Home";
import TaskPage from "./pages/TaskPage";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/users" element={<UserPage />} />
      </Routes>
    </div>
  );
}

export default App;
