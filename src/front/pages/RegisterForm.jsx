import React, { useState } from "react";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating user:", formData);
    // You could call your API here
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Register</h2>

        <input
          name="first"
          placeholder="First Name"
          value={formData.first}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="last"
          placeholder="Last Name"
          value={formData.last}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Join Now
        </button>
      </form>
    </div>
  );
};

// Adjust the border color to match your navbar orange
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "320px",
    padding: "30px",
    border: "4px solid #FF6600", // <- use your navbar orange here
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "10px",
    textTransform: "uppercase",
    color: "#333",
  },
  input: {
    padding: "12px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    outline: "none",
  },
  button: {
    padding: "12px",
    backgroundColor: "#FF6600",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    textTransform: "uppercase",
  },
};

export default RegisterForm;
