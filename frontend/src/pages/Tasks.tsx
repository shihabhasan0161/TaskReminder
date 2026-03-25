import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

interface Task {
  id: number;
  title: string;
  content: string;
  due_date: string | null;
  is_completed: boolean;
  created_at: string;
}

export default function Tasks() {
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [dueDate, setDueDate] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, logout } = useAuth();

  const fetchTasks = useCallback(async () => {
    try {
      const [activeRes, completedRes] = await Promise.all([
        api.get("/api/tasks/?is_completed=false"),
        api.get("/api/tasks/?is_completed=true"),
      ]);
      setActiveTasks(activeRes.data);
      setCompletedTasks(completedRes.data);
      setError("");
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = async (id: number) => {
    try {
    await api.delete(`/api/tasks/${id}/`);
    fetchTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  const handleComplete = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/api/tasks/${id}/complete/`, {
        is_completed: !currentStatus,
      });
      fetchTasks();
    } catch {
      setError("Failed to update task");
    }
  }

  // const handleAddToCalendar = async (task: Task) => {
  //   try {

  //   } catch {
      
  //   }
  // }

  return (
    <div>
        <div>
            <h2>My Tasks</h2>
            <div>
                {/* <Link to="/create"}>Add Task</Link> */}
                <button onClick={logout}>Logout</button>
            </div>
        </div>
    </div>
  );
}
