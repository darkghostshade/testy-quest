import React from 'react';
import {useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Logout } from './userSlice';
import Cookies from 'js-cookie'; // Import Cookies
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook




const Navs = () => {
  const navigate = useNavigate(); // Initialize navigate
  const dispatch = useDispatch(); // Getting the dispatch function
  
  const handleLogOut = (e) => {
    console.log('logedout')
    e.preventDefault();
    dispatch(Logout()); // Dispatching the Login action
    navigate('/Login');
  };
  if (Cookies.get('firebaseToken') !== undefined){
    return( 
      <div class = "navbar-nav">
        <li class="nav-item aling ">
         <a class="nav-link text-warning hover-nav" href="../QuestBoardManager">◈ Manage Quest Board</a>
        </li>
        <li class="nav-item aling ">
        <a class="nav-link text-warning hover-nav" href="../QuestionForm">◈ Question Creation</a>
        </li>
        <li class="nav-item aling ">
          <p class="nav-link hover-nav text-warning" onClick={handleLogOut}> ◈ Logout</p>
        </li>
        <li class="nav-item aling ">
          <a class="nav-link hover-nav text-warning" href="../GetLoginToken"> ◈ Get Token</a>
        </li>
      </div> 
         
    ) ;
  }
  else{

    
  } 
};

export class TestQuestNavbar extends React.Component {
  render() {
    
    return (
    <nav class=" invis-navbar navbar navbar-expand-lg navbar-dark warning mb-1">
        <a class="navbar-brand" href="./Home"> Testy Quest</a>
        <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ">
            <li class="nav-item ">
                <a class="nav-link text-warning hover-nav" href="./Home"> ◈ Home</a>
            </li>
            <li class="nav-item aling ">
                <a class="nav-link text-warning hover-nav" href="../Login">◈ Login</a>
            </li>
            <li class="nav-item aling ">
                <a class="nav-link text-warning hover-nav" href="../Register">◈ Register</a>
            </li>
            <Navs/>
        </ul>
        </div>
      </nav>
    );
  }
}

export default TestQuestNavbar;