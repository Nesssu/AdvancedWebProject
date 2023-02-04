import './App.css';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/">Features</Nav.Link>
              <Nav.Link href="/">Pricing</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
