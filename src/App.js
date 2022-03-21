import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import {config} from "dotenv";
import Home from "./Components/Home";
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const clientID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = "http://localhost:3000/home";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";


function App() {
  const [token, setToken] = useState("");
  useEffect(()=>{
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)
  }, []);

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }
  const link = `${AUTH_ENDPOINT}?client_id=${clientID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-top-read,playlist-modify-public,playlist-modify-private,streaming,user-read-email, user-read-private, user-read-playback-state, user-modify-playback-state`


  return (
    <div className="App">

      <a href={link}>Login to Spotify</a>

    </div>
  );
}

export default App;
