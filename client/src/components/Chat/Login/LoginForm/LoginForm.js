import React, {useRef} from "react";
import {TextField, Button} from "@material-ui/core";
import axios from "axios";

const LoginForm = ({setUserDataForChat}) => {
  const userNameInput = useRef("");

  const enterChatClick = () =>{
    setUserName(userNameInput.current.value);
  }

  const sendData = async () => {
    return await axios.post('http://localhost:5002/api/upload');
  }

  const setUserName = (userName) =>{
    if(userName != ""){
      setUserDataForChat({
        user_name: userName,
      });
    }
      
    else{
      const data = new FormData();
      try{
        sendData(data)
          .then(res=>{
            setUserDataForChat({
              user_name: userName,
            });
          })
          .catch( error => {
            alert(error);
          })
      }catch (e) {

      }
    }
  }

  return(
    <form className="login-form" autoComplete="off">
      <TextField
        id="chat-username"
        label="Enter Username"
        margin="normal"
        fullWidth
        rows="1"
        inputRef={userNameInput}
        onKeyDown={event => {
          if(event.key === "Enter"){
            event.preventDefault();
            setUserName(event.target.value);
          }
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={enterChatClick}
      >
        Enter Chat
      </Button>
    </form>
  )
}

export default LoginForm;