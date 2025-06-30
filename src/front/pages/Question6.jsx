import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Question6 = () => {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  const options = ["Male", "Female", "Doesn't matter"];

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Do you prefer male or female?</h2>

      <div style={styles.options}>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            style={{
              ...styles.option,
              ...(selected === option ? styles.selected : {}),
            }}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        style={styles.nextButton}
        onClick={() => navigate("/question7")}
        disabled={!selected}
      >
        Next
      </button>
      <p style={styles.stepText}>Step 6 of 8</p>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f6f2eb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    width: "100%",
    maxWidth: 400,
  },
  option: {
    padding: 15,
    fontSize: 16,
    backgroundColor: "#ffffff",
    border: "2px solid #ccc",
    borderRadius: 10,
    textAlign: "center",
    cursor: "pointer",
  },
  selected: {
    borderColor: "#000",
    backgroundColor: "#d9f2e6",
  },
  nextButton: {
    marginTop: 30,
    padding: "12px 30px",
    backgroundColor: "#004d40",
    color: "#fefcd4",
    fontWeight: "bold",
    border: "none",
    borderRadius: 30,
    cursor: "pointer",
  },
  stepText: {
  marginTop: "10px",
  fontSize: "14px",
  color: "#666",
},
};
export default Question6;