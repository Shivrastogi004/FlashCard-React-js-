const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root@123', // replace with your MySQL password
  database: 'flashcards_db',
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// API routes
app.get('/flashcards', (req, res) => {
  const sql = 'SELECT * FROM flashcards';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/flashcards', (req, res) => {
  const { question, answer } = req.body;
  const sql = 'INSERT INTO flashcards (question, answer) VALUES (?, ?)';
  db.query(sql, [question, answer], (err) => {
    if (err) throw err;
    res.status(201).send('Flashcard added');
  });
});

app.put('/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  const sql = 'UPDATE flashcards SET question = ?, answer = ? WHERE id = ?';
  db.query(sql, [question, answer, id], (err) => {
    if (err) throw err;
    res.send('Flashcard updated');
  });
});

app.delete('/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM flashcards WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) throw err;
    res.send('Flashcard deleted');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
