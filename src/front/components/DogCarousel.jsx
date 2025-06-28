import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import DogCard from './DogCard';

const dogs = [
  {
    id: 1,
    name: "Jack",
    age: 2,
    location: "Orlando, Florida",
    tags: ["Loyal", "Active", "Friendly"],
    imgUrl: "https://media.4-paws.org/0/c/7/e/0c7e157aabf6ef2f316c05607813b130c994f293/VIER%20PFOTEN_2019-03-15_001-2886x1999.jpg"
  },
  {
    id: 2,
    name: "Charlie",
    age: 2,
    location: "Austin, Texas",
    tags: ["Playful", "Calm"],
    imgUrl: "https://www.petlandtexas.com/wp-content/uploads/2022/04/shutterstock_1290320698-1-scaled.jpg"
  },
  {
    id: 3,
    name: "Max",
    age: 3,
    location: "Denver, Colorado",
    tags: ["Active", "Protective", "Family-Oriented"],
    imgUrl: "https://cdn.royalcanin-weshare-online.io/3DKT5m8BN5A8uWWASDMR/v1/ptpc1s3-welsh-pembroke-corgi-puppy-running-outside-in-a-garden"
  },
];

export default function DogCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent(i => (i - 1 + dogs.length) % dogs.length);
  const next = () =>
    setCurrent(i => (i + 1) % dogs.length);

  return (
    <Container className="d-flex justify-content-center align-items-center my-5">
      <Button variant="outline-secondary" onClick={prev} aria-label="Previous">
        ‹
      </Button>

      <DogCard dog={dogs[current]} />

      <Button variant="outline-secondary" onClick={next} aria-label="Next" className="ms-3">
        ›
      </Button>
    </Container>
  );
}
