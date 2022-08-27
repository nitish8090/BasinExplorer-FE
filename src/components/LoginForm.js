// Material UI
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

// Bootstrap
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import './LoginForm.css';
import { Config } from '../config';

// Component
export default function LoginForm() {
  const [userName, setUserName] = useState('');
  const [password, setPassWord] = useState('');
  const [errorMessage, seterrorMessage] = useState('');

  let navigate = useNavigate();

  // If valid token, go to map page
  useEffect(() => {
    if (localStorage.getItem('beAuthToken')) {
      navigate("/map");
    }
  });

  // Submit login details
  function submitLoginForm(event) {
    event.preventDefault();
    console.log(userName, password)

    const url = `${Config.base_url}/User/GetToken/`
    axios.post(url, {
      username: userName,
      password: password
    })
      .then(function (response) {
        localStorage.setItem('beAuthToken', response.data.token);
        seterrorMessage("")
        navigate("/map");
      })
      .catch(function (error) {
        seterrorMessage("Invalid Login Details")
        console.log(error);
      });
  }

  // Handle changes in username and password
  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassWord(event.target.value);
  }

  return (
    <div className='LoginForm'>
      <div className='project-description'>
        <Badge bg="secondary">Preview </Badge>
        <p>Started as a project demo, Basin Explorer was a two day project, built to show GIS Development capabilites. The web app has a login screen, a map view and shows the river map of the basin of a specific area.</p>
        <h4>About the area of interest</h4>
        <p>Tehri Dam, Chokhala, Uttarakhand, the tallest dam in India.</p>
        <h4>Access:</h4>
        <p>The app is designed to be used by two types of users:
          <ul>
            <li>Admin user
              <ul>
                <li>Has access to river streams</li>
              </ul>
            </li>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>admin</td>
                  <td>admin</td>
                </tr>
              </tbody>
            </Table>

            <li>Basic user
              <ul><li>Has access to basic maps only</li></ul>
            </li>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>simpleuser</td>
                  <td>basinexplorer</td>
                </tr>
              </tbody>
            </Table>
          </ul>
        </p>
        <h4>Technical details:</h4>
        <p>The projects is powered by
          <ul>
            <li><Badge bg="secondary">React</Badge> as a front end, </li>
            <li><Badge bg="secondary">GeoDjango</Badge> as its backend and </li>
            <li>is hosted in on a <Badge bg="secondary">Nginx</Badge> server.</li>
          </ul>
        </p>
        <p>
          The authentication is handled by Django's Token authentication.
        </p>
        <p>
          The rendering is done by open layers and User data is fetched from Django's REST APIs.
        </p>
      </div>

      <div className='project-login'>
        <code>{errorMessage ?
          <div className='errorMessage' >{errorMessage}</div> : ''
        }</code>

        <Box className='LoginBox' component="form" noValidate autoComplete="off" onSubmit={submitLoginForm}>
          <TextField sx={{ margin: '0.5em' }} label="Username" variant="outlined" onChange={handleUserNameChange} />
          <TextField sx={{ margin: '0.5em' }} label="Password" type="password" variant="outlined" onChange={handlePasswordChange} />
          <Button variant="contained" sx={{ margin: '0.5em' }} type='submit' >Login</Button>
        </Box>
      </div>

    </div>
  )
}