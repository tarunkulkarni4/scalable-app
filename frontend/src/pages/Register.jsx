import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", formData);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg w-96 space-y-4 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-2 rounded bg-gray-700 outline-none"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-700 outline-none"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-700 outline-none"
          onChange={handleChange}
          required
        />

        <button className="w-full bg-blue-600 py-2 rounded font-bold hover:bg-blue-700">
          Register
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
