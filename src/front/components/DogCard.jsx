import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, ListGroup } from 'react-bootstrap';
import { useReducer } from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';

export default function DogCard({ dog }) {
  // const [state, dispatch] = useReducer(stateReducer, initialStore)
  //  const [token, setToken] = useState (null);
  const {store, dispatch} = useGlobalReducer ()

  const [showModal, setShowModal] = useState(false);

  const PetAuth= async() => {
    const result= await fetch ("https://turbo-space-train-x5pjwrx79p6726x7g-3001.app.github.dev/api/pets/",{
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
      },})
      const body = await result.json()
      dispatch ({
        type: "set_pets",
        payload: body
      })
    }

  //     body: JSON.stringify({      
  //       grant_type: "client_credentials",      
  //       client_id: import.meta.env.VITE_PET_FINDER_CLIENT_ID,      
  //       client_secret: import.meta.env.VITE_PET_FINDER_SECRET,
  //     })
  //   })
  //   const data = await result.json ()
  //   setToken (data.accessToken)
  //   return data
  // }

  // const getDogs= async (token) => {
  //   const result= await fetch ("https://api.petfinder.com/v2/animals",{
  //     method: "GET", 
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${token}`
  //     }, 
  //   })
  //   const data = await result.json ()
  //   return data
  // }

  useEffect(() => {
    const getTokenAndFetchPets = async () => {
           const authData = await PetAuth(); 
        };  
        getTokenAndFetchPets();
  }, []);

  return (
    <>
      {/* — Card */}
      <Card style={{ width: '22rem' }} className="mx-4 text-center">
        <Card.Img
          variant="top"
          src={dog.imgUrl}
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
            src={dog.imgUrl}
            alt={dog.name}
            className="mb-3 rounded"
          />
          <ListGroup variant="flush">
            <ListGroup.Item><strong>Age:</strong> {dog.age} years</ListGroup.Item>
            <ListGroup.Item><strong>Location:</strong> {dog.location}</ListGroup.Item>
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

