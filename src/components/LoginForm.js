import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import './LoginForm.css';

import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";



export default function LoginForm() {
    const [userName, setUserName] = useState('');
    const [password, setPassWord] = useState('');
    const [errorMessage, seterrorMessage] = useState('');

    let navigate = useNavigate();

    function submitLoginForm(event){
      event.preventDefault();
      console.log(userName, password)

      const url = 'http://beta.fruitly.co.in:51000/User/GetToken/'
      axios.post(url, {
        username: userName,
        password: password
      })
      .then(function (response) {
        localStorage.setItem('beAuthToken', response.data.token);
        seterrorMessage("")
        console.log(response);
        navigate("/map");
      })
      .catch(function (error) {
        seterrorMessage("Invalid Login Details")
        console.log(error);
      });
    }

    const handleUserNameChange = (event) => {
      setUserName(event.target.value);
    }

    const handlePasswordChange = (event) => {
      setPassWord(event.target.value);
    }

    return (
      <div className='LoginForm'>
        <code>{errorMessage?
          <div className='errorMessage' >{errorMessage}</div>:''
}</code>
        
       <Box className='LoginBox'
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={submitLoginForm}
        
      >
        <TextField sx={{margin: '0.5em'}} label="Username" variant="outlined" onChange={handleUserNameChange}/>
        <TextField sx={{margin: '0.5em'}} label="Password" type="password" variant="outlined" onChange={handlePasswordChange}/>
        <Button variant="contained" sx={{margin: '0.5em'}} type='submit' >Login</Button>
      </Box>

      <div className='hintBox'>
        <h1>Hints</h1>
        <table>
          <tr>
            <th>Usernames</th>
            <th>Passwords</th>
          </tr>
          <tr>
            <td>admin</td>
            <td>admin</td>
          </tr>
          <tr>
            <td>simpleuser</td>
            <td>basinexplorer</td>
          </tr>
        </table>
      </div>
  
      </div>
    )
  }