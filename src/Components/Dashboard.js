import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = ({ onFlashcardsUpdate }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get('http://localhost:5000/flashcards');
        setFlashcards(response.data);
      } catch (err) {
        console.error('Error fetching flashcards:', err);
      }
    };
    fetchFlashcards();
  }, [onFlashcardsUpdate]);

  const handleAddFlashcard = async () => {
    if (!question || !answer) {
      alert('Both question and answer are required!');
      return;
    }
    try {
      await axios.post('http://localhost:5000/flashcards', { question, answer });
      setQuestion('');
      setAnswer('');
      onFlashcardsUpdate(); // Notify parent component
    } catch (err) {
      console.error('Error adding flashcard:', err);
    }
  };

  const handleDeleteFlashcard = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/flashcards/${id}`);
      setFlashcards(flashcards.filter(fc => fc.id !== id));
      onFlashcardsUpdate(); // Notify parent component
    } catch (err) {
      console.error('Error deleting flashcard:', err);
    }
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Flashcard Admin Dashboard</h2>
      <div className="dashboard-container">
        <div className="sidebar">
          <h3>Existing Flashcards</h3>
          <ul className="flashcard-list">
            {flashcards.map(flashcard => (
              <li
                key={flashcard.id}
                className={`flashcard-list-item ${selectedFlashcard === flashcard.id ? 'selected' : ''}`}
                onClick={() => setSelectedFlashcard(flashcard.id)}
              >
                {flashcard.question}
              </li>
            ))}
          </ul>
        </div>
        <div className="main-content">
          <div className="dashboard-form">
            <input
              type="text"
              placeholder="Enter question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="dashboard-input"
            />
            <textarea
              placeholder="Enter answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="dashboard-textarea"
            />
            <button onClick={handleAddFlashcard} className="dashboard-button">Add Flashcard</button>
          </div>
          {selectedFlashcard && (
            <div className="flashcard-list-item-detail">
              {flashcards.find(fc => fc.id === selectedFlashcard)?.question}
              <br />
              {flashcards.find(fc => fc.id === selectedFlashcard)?.answer}
              <button onClick={() => handleDeleteFlashcard(selectedFlashcard)} className="delete-button">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
