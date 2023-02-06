import './App.css';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { Button } from 'bootstrap';

function App() {
  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() =>
  {
    const token = localStorage.getItem('auth_token');
    if (token)
    {
      setJwt(token);
    }
  }, []);

  const logout = () =>
  {
    localStorage.removeItem('auth_token');
  }

  return (
    <Router>
      <div className='App'>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Nav className='me-auto'>
              <Nav.Link href="/home">Home</Nav.Link>
            </Nav>
            {jwt === null ?
              <Nav>
                <Nav.Link href="/">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </Nav>
              :
              <Nav>
                <Nav.Link href="/" onClick={logout}>Logout</Nav.Link>
              </Nav>
            }
          </Container>
        </Navbar>
        <Routes>
          <Route path="/" element={<Login setJwt={setJwt}/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/home" element={<Home jwt={jwt}/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
