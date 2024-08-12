import React, { useState } from 'react';
import axios from 'axios';
import './Flashcard.css';

const Flashcard = ({ flashcard, onDelete }) => {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    setFlipped(!flipped);
  };

  const handleDelete = (event) => {
    event.stopPropagation(); // Prevent triggering flip on click
    axios.delete(`http://localhost:5000/flashcards/${flashcard.id}`)
      .then(() => {
        onDelete(flashcard.id); // Notify parent component to remove the flashcard
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="flashcard-container flashcard-animation">
      <div className={`flashcard ${flipped ? 'flashcard-flipped' : ''}`} onClick={handleClick}>
        <div className="flashcard-inner">
          <div className="flashcard-side flashcard-front">
            <div className="card">
              <div className="card__content">
                <h2 className="card__title">{flashcard.question}</h2>
              </div>
            </div>
          </div>
          <div className="flashcard-side flashcard-back">
            <div className="card">
              <div className="card__content">
                <p className="card__description">{flashcard.answer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="delete-button" onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default Flashcard;
