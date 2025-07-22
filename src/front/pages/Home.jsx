import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const [zipCode, setZipCode] = useState("");
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!zipCode.trim()) return alert("Please enter your Zip Code");
    navigate("/question1", { state: { zipCode } });
  };
  useEffect(() => {
    if (!!store.token) return navigate("/find-your-pup");
  }, [store.token]);

  return (
    <section
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "60px 40px",
        flexWrap: "wrap",
      }}
    >
      {/* Left Section */}
      <div
        style={{
          flex: "1",
          minWidth: "300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px"
        }}>
        <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "20px" }}>
          Match With the Perfect Pup Near You <br />
          Join SnoutScout Today!
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your ZipCode.."
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            style={{
              backgroundColor: "white",
              color: "#500",
              padding: "10px 16px",
              border: "orange 3px solid",
              borderRadius: "10px",
              marginBottom: "20px",
              width: "100%",
              maxWidth: "250px",
              fontSize: "16px",
            }}
          />
          <br />
          <button
            type="submit"
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "10px 24px",
              borderRadius: "15px",
              fontWeight: "bold",
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Get Started
          </button>
        </form>
      </div>

      {/* Right Images */}
      <div
        style={{
          flex: "1",
          minWidth: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          position: "relative",
          marginTop: "10px",
        }}
      >
        <img
          src="https://i.pinimg.com/474x/26/6b/bd/266bbd5746e8c99de4b425c7edef1c16.jpg"
          alt="puppy1"
          style={{
            width: "250px",
            height: "400px",
            objectFit: "cover",
            borderRadius: "30px",
            zIndex: 2,
          }}
        />
        <img
          src="https://images.ctfassets.net/2djrn56blv6r/63KKR8wAPEaxLGr8xThRP4/3e0ea178bd23c45afd28d579ab5237e8/akc-pupill-hdr-new-new.jpg"
          alt="puppy2"
          style={{
            width: "200px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "20px",
            position: "absolute",
            bottom: "50px",
            left: "20px",
            zIndex: 1,
          }}
        />
        <img
          src="https://t3.ftcdn.net/jpg/02/74/06/48/360_F_274064877_Tuq84kGOn5nhyIJeUFTUSvXaSeedAOTT.jpg"
          alt="puppy3"
          style={{
            width: "170px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "20px",
            position: "absolute",
            bottom: "20px",
            right: "50px",
            zIndex: 1,
          }}
        />
      </div>
    </section>
  );
};



export default Home;
