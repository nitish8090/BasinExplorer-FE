import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import './NavBar.css';


export default function NavBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home" className='nav-bar'>Basin Explorer</Navbar.Brand>
    </Navbar>
  )
}
