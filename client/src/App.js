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
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
              <Nav.Link href="/home">Home</Nav.Link>
            </Nav>
            <Form className="d-flex" style={{width: "40%", minWidth: '600px', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-light">Search</Button>
            </Form>
            {/* If the user is not logged in, Login and register links are shown in the navbar */}
            {jwt === null ?
              <Nav className='me-0'>
                <Nav.Link href="/">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </Nav>
              :
              <Nav className='me-0'>
                {/* If the user is logged in, profile and logout links are shown in the navbar */}
                <Nav.Link href="/profile" >Profile</Nav.Link>
                <Nav.Link href="/" onClick={logout}>Logout</Nav.Link>
              </Nav>
            }
          </Container>
        </Navbar>
        <Routes>
          <Route path="/" element={<Login setJwt={setJwt} setUser={setUser}/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/home" element={<Home jwt={jwt} user={user}/>}/>
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
