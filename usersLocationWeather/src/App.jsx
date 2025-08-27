import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './components/Users/Users';
import ListSavedUsers from './components/ListSavedUsers/ListSavedUsers';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/saved" element={<ListSavedUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
