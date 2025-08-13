import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Matches = () => {
  const { store } = useGlobalReducer(); 
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${store.BASE_API_URL}api/match/${store.user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${store.token}`,   // make sure user is logged in
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }

      const data = await response.json();
      setMatches(data.matches || []); 
    } catch (err) {
      setError("Error fetching matches: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) return <div>Loading Matches...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Best Matches</h2>
      <div style={styles.grid}>
        {matches.length === 0 ? (
          <p>No Matches Found. Try Updating Your Answers.</p>
        ) : (
          matches.map((match, index) => (
            <div key={index} style={styles.card}>
              <h3>{match.pet.name}</h3>
              <p><strong>Size:</strong> {match.pet.size}</p>
              <p><strong>Age:</strong> {match.pet.age}</p>
              <p><strong>Gender:</strong> {match.pet.gender}</p>
              <p><strong>Good With:</strong> {match.pet.good_with}</p>
              <p><strong>Care and Behavior:</strong> {match.pet.care_and_behavior}</p>
              <p><strong>Coat Length:</strong> {match.pet.coat_length}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem", 
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1rem",
  },
  card: {
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
};

export default Matches;
