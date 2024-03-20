import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Logout } from './userSlice';


const Navs = () => {

  const user = useSelector(state => state.User);
  const dispatch = useDispatch(); // Getting the dispatch function
  
  const handleLogOut = (e) => {
    console.log('logedout')
    e.preventDefault();
    dispatch(Logout()); // Dispatching the Login action
  };
  console.log(user.Loged_in)
  if (user.Loged_in) {
    return( 
        <li class="nav-item">
          <p class="nav-link hover-nav text-warning" onClick={handleLogOut}> ◈ Logout</p>
        </li>
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
                <a class="nav-link text-warning hover-nav" href="./Login">◈ About</a>
            </li>
            <Navs/>
           
        </ul>
        </div>
      </nav>
    );
  }
}

export default TestQuestNavbar;