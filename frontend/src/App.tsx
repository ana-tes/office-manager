import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Post from './components/user/Post';
import Edit from './components/user/Edit';
import Create from './components/user/Create';

function App(): JSX.Element {
  return (
    <div className="App">
      <Navbar />
      <div className={'container'}>
        <Routes>
          <Route path="/"  element={<Home/>} />
          <Route path="/user/:userId"  element={<Post/>} />
          <Route path="/edit/:userId"  element={<Edit/>} />
          <Route path="/create"  element={<Create/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
