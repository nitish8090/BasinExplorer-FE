import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';

// Components
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm'
import MapWindow from './components/MapWindow';


function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes >
        <Route path="/" element={<LoginForm />} />
        <Route path="/map" element={<MapWindow />} />
      </Routes>
    </div>
  );
}

export default App;
