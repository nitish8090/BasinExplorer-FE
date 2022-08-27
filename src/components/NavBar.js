import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import './NavBar.css';


export default function NavBar() {

  let navigate = useNavigate();

  const handleLogOut = function (){
    localStorage.removeItem('beAuthToken');
    navigate("/");
  }


  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Navbar.Brand className='nav-bar'>
        <img
          alt=""
          src={process.env.PUBLIC_URL + "/favicon.png"}
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{' '}
        Basin Explorer
      </Navbar.Brand>
      { 
      window.innerWidth  > 600 &&  
      <Navbar.Text  >A Project by <a href="https://www.nitishpatel.in">Nitish Patel</a></Navbar.Text>
      }

      { localStorage.getItem('beAuthToken') &&
          <Button  variant="secondary" onClick={handleLogOut} className='logoutButton'>Logout </Button >
        }
      
    </Navbar>
  )
}
