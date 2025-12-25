import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Tasks />} />
          <Route path="/create" element={<CreateTask />} />
        </Route>
      </Routes>
    </>
  );
}
