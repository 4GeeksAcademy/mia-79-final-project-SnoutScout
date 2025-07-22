import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Question2 = () => {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  const options = ["Not very active", "Moderately active", "Very active"];

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>What is your activity level?</h2>

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
        onClick={() => {
          dispatch({
            type: "update_answer",
            payload: {
              step: "activity",
              answer: selected
            }
          });
          navigate("/question3");
        }}
        disabled={!selected}
      >
        Next
      </button>
      <p style={styles.stepText}>Step 2 of 8</p>
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
  }
};

export default Question2;