import './styles/UsernameDisplay.css';  
import React from "react";

function UsernameDisplay({ username }) {
    return <div className="Username-display">User: {username}</div>;
  }


export default UsernameDisplay;