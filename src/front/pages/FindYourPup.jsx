import React from 'react';
import DogCarousel from '../components/DogCarousel';

export default function FindYourPup() {
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
