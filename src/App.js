import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Flashcard from './Components/Flashcard';
import Dashboard from './Components/Dashboard';
import './App.css';

const App = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/flashcards')
      .then(response => setFlashcards(response.data));
  }, []);

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((currentIndex - 1 + flashcards.length) % flashcards.length);
  };

  const handleDelete = () => {
    const cardId = flashcards[currentIndex].id;
    axios.delete(`http://localhost:5000/flashcards/${cardId}`)
      .then(() => {
        setFlashcards(flashcards.filter(card => card.id !== cardId));
        if (flashcards.length > 1) {
          setCurrentIndex((currentIndex - 1 + flashcards.length) % flashcards.length);
        } else {
          setCurrentIndex(0);
        }
      });
  };

  return (
    <div className="app">
      <Dashboard onFlashcardsUpdate={() => {
        axios.get('http://localhost:5000/flashcards')
          .then(response => setFlashcards(response.data));
      }} />
      <div className="flashcard-container">
        {flashcards.length > 0 && (
          <>
            <Flashcard flashcard={flashcards[currentIndex]} />
            <div className="navigation">
              <button onClick={handlePrevious} className="nav-button">Previous</button>
              <button onClick={handleNext} className="nav-button">Next</button>
            </div>
            <button onClick={handleDelete} className="delete-button">Delete</button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
