import { useState, useEffect, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";


export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



  const startEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
  };

  const fetchProfile = async () => {
  try {
    const res = await API.get("/auth/me");
    setUser(res.data.user);
  } catch (err) {
    console.log(err);
  }
};

  

// SAVE EDIT
const saveEdit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.put(`/tasks/${editingTask._id}`, { title });

    setTasks(
      tasks.map((t) =>
        t._id === editingTask._id ? res.data.task || res.data : t
      )
    );

    setEditingTask(null);
    setTitle("");
    toast.success("Task updated successfully ✨");

  } catch (err) {
    toast.error("Failed to update task ❌");
    console.log(err);
  }
};

// TOGGLE COMPLETE
const toggleComplete = async (task) => {
  try {
    const res = await API.put(`/tasks/${task._id}`, {
      completed: !task.completed,
    });

    setTasks(
      tasks.map((t) =>
        t._id === task._id ? res.data.task || res.data : t
      )
    );

    toast.success("Status updated 🔄");

  } catch (err) {
    toast.error("Failed to update status ❌");
    console.log(err);
  }
};

const fetchTasks = async () => {
  try {
    setLoading(true);
    const res = await API.get("/tasks");
    setTasks(res.data.tasks);
  } catch (err) {
    toast.error("Failed to load tasks");
  } finally {
    setLoading(false);
  }
};

  

 const addTask = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/tasks", { title });
    setTasks([res.data.task || res.data, ...tasks]);
    setTitle("");
    toast.success("Task added successfully 🎉");
  } catch (err) {
    toast.error("Failed to add task");
  }
};

 const deleteTask = async (id) => {
  if (!confirm("Are you sure you want to delete this task?")) return;

  try {
    await API.delete(`/tasks/${id}`);
    setTasks(tasks.filter((task) => task._id !== id));
    toast.success("Task deleted successfully 🗑");
  } catch (err) {
    toast.error("Failed to delete task");
  }
};

  useEffect(() => {
  fetchTasks();
  fetchProfile();   // 👈 Add here
}, []);


  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold">Dashboard</h1>

  {user && (
    <div className="flex items-center gap-4">
      <span className="px-3 py-1 bg-gray-700 rounded-full">
        {user.name}
      </span>
      <button onClick={logout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
        Logout
      </button>
    </div>
  )}
</div>


      <form onSubmit={editingTask ? saveEdit : addTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={title}
          placeholder="Enter task title"
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 outline-none"
          required
        />
        <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          {editingTask ? "Save" : "Add"}
        </button>
      </form>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-gray-800 outline-none"
      />

      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-600" : "bg-gray-700"}`}>All</button>
        <button onClick={() => setFilter("pending")} className={`px-3 py-1 rounded ${filter === "pending" ? "bg-blue-600" : "bg-gray-700"}`}>Pending</button>
        <button onClick={() => setFilter("completed")} className={`px-3 py-1 rounded ${filter === "completed" ? "bg-blue-600" : "bg-gray-700"}`}>Completed</button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 && <p className="text-gray-400 text-center">No tasks yet. Add one!</p>}

        {tasks
          .filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .filter((task) => {
            if (filter === "pending") return task.status === "pending";
            if (filter === "completed") return task.status === "completed";
            return true;
          })
          .map((task) => (
            <div key={task._id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task)} className="w-5 h-5" />
                <p className={`${task.completed ? "line-through text-gray-400" : ""}`}>{task.title}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(task)} className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                <button onClick={() => deleteTask(task._id)} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Delete</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
