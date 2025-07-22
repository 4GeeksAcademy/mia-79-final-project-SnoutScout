import React from 'react';
import DogCarousel from '../components/DogCarousel';
import { useEffect } from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { useNavigate } from 'react-router-dom';

export default function FindYourPup() {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  useEffect(() => {
    if (!store.token) return navigate("/login");
  }, [store.token]);
  return (
    <div>
      <h1 className="text-center my-4">Find Your Pup</h1>
      <p className="text-center text-muted mb-4">
        Ready to meet your match? Navigate with the buttons below to discover your perfect pup.
      </p>
      <DogCarousel />
    </div>
  );
}
