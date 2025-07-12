import React, { useState } from 'react';
import { Card, Badge, Button, Modal, ListGroup } from 'react-bootstrap';

export default function DogCard({ dog }) {
  
  const [showModal, setShowModal] = useState(false);



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
            <Button variant="outline-danger" aria-label="Favorite">♥</Button>
            <Button variant="outline-dark">✕</Button>
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

