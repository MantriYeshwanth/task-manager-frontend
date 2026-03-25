import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import StatsCard from "../components/StatsCard";
import { getTasks, createTask, updateTask, deleteTask, getTaskAnalytics } from "../api/taskApi";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    page: 1,
    limit: 5,
  });
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const tasksResponse = await getTasks(filters);
      setTasks(tasksResponse.data.tasks);
      setTotalPages(tasksResponse.data.pages);

      const analyticsResponse = await getTaskAnalytics();
      setStats(analyticsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    }
  }, [filters]);


 useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?.token) {
    navigate("/");
    return;
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchData();
}, [fetchData, navigate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) {
      setError("Title is required");
      return;
    }

    try {
      await createTask({ title, description, priority, dueDate });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setError("");
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const onUpdateTask = async (id, updates) => {
    try {
      await updateTask(id, updates);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteTask(id);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div className="container">
        <h1>Dashboard</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <section className="stats-grid">
          <StatsCard label="Total" value={stats?.totalTasks ?? 0} />
          <StatsCard label="Completed" value={stats?.completedTasks ?? 0} />
          <StatsCard label="Pending" value={stats?.pendingTasks ?? 0} />
          <StatsCard label="Completion %" value={stats?.completionRate ?? 0} />
        </section>

        <section>
          <h3>Create Task</h3>
          <form onSubmit={handleCreate} className="form">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="" disabled>Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="Due Date" />
            <button type="submit">Add Task</button>
          </form>
        </section>

        <section>
          <h3>Search Tasks</h3>
          <div className="filters">
            <input
              placeholder="Search task title or description..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
            />

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value, page: 1 })
              }
            >
              <option value="">All Status</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value, page: 1 })
              }
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </section>

        <section>
          <h3>Tasks</h3>
          {tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task._id} task={task} onDelete={onDelete} onUpdateTask={onUpdateTask} />
            ))
          )}
        </section>

        <section style={{ marginTop: "1rem" }}>
          <button
            disabled={filters.page === 1}
            onClick={() =>
              setFilters({ ...filters, page: filters.page - 1 })
            }
          >
            Prev
          </button>

          <span style={{ margin: "0 1rem" }}>
            Page {filters.page} of {totalPages}
          </span>

          <button
            disabled={filters.page === totalPages}
            onClick={() =>
              setFilters({ ...filters, page: filters.page + 1 })
            }
          >
            Next
          </button>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
