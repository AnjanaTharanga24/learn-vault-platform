import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import { UserProvider } from './common/UserContext';
import UserProfile from './pages/User-Profile/UserProfile';

function App() {
  return (
    <UserProvider>
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Signup/>} />
          <Route path="/profile" element={<UserProfile/>} />
        </Routes>
      </Router>
    </div>
    </UserProvider>
  );
}

export default App;
