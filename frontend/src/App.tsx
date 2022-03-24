import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PostUser from './components/user/Post';
import EditUser from './components/user/Edit';
import CreateUser from './components/user/Create';
import PostTeam from './components/team/Post';
import EditTeam from './components/team/Edit';
import CreateTeam from './components/team/Create';

function App(): JSX.Element {
  return (
    <div className="App">
      <Navbar />
      <div className={'container'}>
        <Routes>
          <Route path="/"  element={<Home/>} />
          <Route path="/user/:userId"  element={<PostUser/>} />
          <Route path="/user/edit/:userId"  element={<EditUser/>} />
          <Route path="/user/create"  element={<CreateUser/>} />
          <Route path="/team/:teamId" element={<PostTeam/>}/>
          <Route path="/team/edit/:userId"  element={<EditTeam/>} />
          <Route path="/team/create"  element={<CreateTeam/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
