// src/front/pages/ShelterLookup.jsx
import React, { useState } from "react";

const ShelterLookup = () => {
  const [zip, setZip] = useState("");
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShelters = async () => {
    if (!zip) return;
    setLoading(true);
    setError(null);
    setShelters([]);

    try {
      const res = await fetch(`/api/shelters/${zip}`);
      if (!res.ok) throw new Error("Failed to fetch shelters");
      const data = await res.json();
      setShelters(data.organizations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Find Animal Shelters Near You</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter ZIP code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={fetchShelters}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {shelters.length > 0 && (
        <div className="mt-4">
          <h4>Found {shelters.length} shelter(s):</h4>
          <ul className="list-group">
            {shelters.map((org) => (
              <li key={org.id} className="list-group-item">
                <h5>{org.name}</h5>
                {org.address && (
                  <p>
                    {org.address.address1}<br />
                    {org.address.city}, {org.address.state} {org.address.postcode}
                  </p>
                )}
                {org.phone && <p><strong>Phone:</strong> {org.phone}</p>}
                {org.website && (
                  <a href={org.website} target="_blank" rel="noreferrer">
                    Visit Website
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !error && shelters.length === 0 && zip && (
        <p className="mt-3 text-muted">No shelters found for ZIP code {zip}.</p>
      )}
    </div>
  );
};

export default ShelterLookup;
