import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export function GotoLogIn(e){
  e.preventDefault()
  console.log()
   window.location= "./login"
}
export class Welcome extends React.Component {
  
  
  render() {
    return (
      <div>
        <p>Welcome</p>
        <button type="button" onClick={GotoLogIn} class="btn btn-dark">log in</button>
        <button type="button" class="btn btn-dark">sign in</button>
      </div>
      
    );
  }
  
}

export default Welcome;