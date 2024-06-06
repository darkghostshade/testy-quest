import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie'; // Import Cookies

export class CookieConsent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accepted: false,
    };
  }

  handleAcceptance = () => {
    this.setState({ accepted: true });
    Cookies.set('testyQuestCookieConsent', 'accepted', { expires: 365 }); // Set cookie to expire in 1 year
  };

  render() {
    const cookieConsent = (
      <div className="cookie-consent alert alert-info alert-dismissible fade show fixed-bottom  " role="alert">
        <strong>Cookies Notice</strong>
        <div class="row">
        <div class="col">
          <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="cookieaccept"checked></input>
          <label class="form-check-label" for="cookieaccept">We use cookies to improve your experience on our website. By continuing to use this site, you agree to our use of cookies.</label>
          </div>
          <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="termsaccept"></input>
          <label class="form-check-label" for="termsaccept">you read the terms of service and by continuing to use this site, you agree to our <b type="button" onClick={this.handleAcceptance} class="btn btn-outline-secondary" >terms of service</b></label>
          </div>
          </div>
        <div class="col ">
          <button type="button " className="btn btn-primary position-absolute top-50 end-0 translate-middle-y me-5" onClick={this.handleAcceptance}>
            Accept
          </button>
        </div>
        </div>
      </div>
    );

    return (
      <div>
        {this.state.accepted ? (
          <div>
            {/* Render the app content here */}
            <h1>Welcome to Testy-Quest!</h1>
          </div>
        ) : (
          cookieConsent
        )}
      </div>
    );
  }
}

export default CookieConsent;