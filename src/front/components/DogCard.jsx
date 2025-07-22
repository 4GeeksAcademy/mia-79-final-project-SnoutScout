import React, { useState } from 'react';
import { Card, Badge, Button, Modal, ListGroup } from 'react-bootstrap';
import useGlobalReducer from '../hooks/useGlobalReducer';

export default function DogCard({ dog, onFavorite, onSkip }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const { store, dispatch } = useGlobalReducer();
  const handleFavoriteClick = async () => {
    try {
      setLoading(true);
      setFavorited(true);    // flash the heart


      const res = await fetch(import.meta.env.VITE_BACKEND_URL + 'api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.token}`,
        },
        body: JSON.stringify({ pet_id: dog.id, pet: dog }),
      });
      if (!res.ok) throw new Error('Failed to favorite');
    } catch (err) {
      console.error("Error adding to Favorite");
      setFavorited(false);
    }
    setLoading(false);
    setFavorited(false);
    onFavorite?.();        // let parent know to go to next
  };

  const handleSkipClick = () => {
    onSkip?.();
  };

  return (
    <>
      {/* — Card */}
      <Card style={{ width: '22rem' }} className="mx-4 text-center">
        <Card.Img
          variant="top"
          src={dog.photos[0].large}
          alt={dog.name}
          style={{ cursor: 'pointer' }}
          onClick={() => setShowModal(true)}
        />
        <Card.Body>
          <Card.Title>{dog.name}</Card.Title>
          <Card.Text>
            {dog.age} years&nbsp;·&nbsp;📍 {dog.location}
          </Card.Text>
          <div className="mb-3">
            {dog.tags.map(tag => (
              <Badge bg="warning" text="dark" key={tag} className="mx-1">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="d-flex justify-content-center gap-2">
            <Button
              variant={favorited ? 'danger' : 'outline-danger'}
              aria-label="Favorite"
              onClick={handleFavoriteClick}
              disabled={loading}
            >
              ♥
            </Button>
            <Button
              variant="outline-dark"
              onClick={handleSkipClick}
              disabled={loading}
            >
              ✕
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* — Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{dog.name} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card.Img
            src={dog.photos[0].small}
            alt={dog.name}
            className="mb-3 rounded"
          />
          <ListGroup variant="flush">
            <ListGroup.Item><strong>Age:</strong> {dog.age} years</ListGroup.Item>
            <ListGroup.Item><strong>Location:</strong> {dog.contact?.address?.city}</ListGroup.Item>
            {dog.tags.map(tag => (
              <ListGroup.Item key={tag}>
                <strong>Tag:</strong> {tag}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

