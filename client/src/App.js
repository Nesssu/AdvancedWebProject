import './App.css';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Post from './pages/Post';
import ViewProfile from './pages/ViewProfile';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { Buffer } from 'buffer';

function App() {
  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() =>
  {
    const token = localStorage.getItem('auth_token');
    if (token)
    {
      const user = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
      setUser(user);
      setJwt(token);
    }
  }, [jwt]);

  const logout = () =>
  {
    localStorage.removeItem('auth_token');
  }

  return (
    <Router>
      <div className='App'>
        {/* Bootsrap navbar is used */}
        <Navbar bg="dark" variant="dark" fixed='top' >
          <Container >
            <Nav className='ms-0'>
              <Nav.Link href="/">Home</Nav.Link>
            </Nav>
            {/* If the user is not logged in, Login and register links are shown in the navbar */}
            {jwt === null ?
              <Nav className='me-0'>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </Nav>
              :
              <Nav className='me-0'>
                {/* If the user is logged in, profile and logout links are shown in the navbar */}
                <Nav.Link href="/profile" >Profile</Nav.Link>
                <Nav.Link href="/login" onClick={logout}>Logout</Nav.Link>
              </Nav>
            }
          </Container>
        </Navbar>
        <Routes>
          <Route path="/login" element={<Login setJwt={setJwt} setUser={setUser}/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<Home jwt={jwt} user={user}/>}/>
          <Route path="/profile" element={<Profile user={user} token={jwt} />} />
          <Route path="/profile/:id" element={<ViewProfile />} />
          <Route path="/post/:id" element={<Post token={jwt} user={user}/>} />
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
