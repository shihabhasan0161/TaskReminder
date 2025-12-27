import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

interface Task {
  id: number;
  title: string;
  content: string;
  created_at: string;
  is_completed: boolean;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  const getTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/tasks/");
      setTasks(response.data);
    } catch {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const deleteTask = async (id: number) => {
    await api.delete(`/api/tasks/delete/${id}/`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
        <div>
            <h2>My Tasks</h2>
            <div>
                {/* <Link to="/create"}>Add Task</Link> */}
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    </div>
  );
}
