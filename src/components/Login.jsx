
import React, { useState } from "react";
import "./Login.css";
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const demoUsers = {
      "admin@gmail.com": {
        password: "admin123",
        role: "admin",
      },
      "user@gmail.com": {
        password: "user123",
        role: "user",
      },
    };

    const account = demoUsers[email.trim().toLowerCase()];

    if (
      account &&
      account.password === password &&
      account.role === role
    ) {
      setError("");
      onLogin({
        email: email.trim().toLowerCase(),
        role: account.role,
      });
    } else {
      setError("Invalid email, password, or role.");
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Job Tracker Login</h2>
        <p>Login to manage your job applications</p>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <label>Login As</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className="login-error">{error}</p>}

        <button type="submit">Login</button>

        <div className="demo-credentials">
          <p><strong>Demo Admin:</strong> admin@gmail.com / admin123</p>
          <p><strong>Demo User:</strong> user@gmail.com / user123</p>
        </div>
      </form>
    </div>
  );
};

export default Login;