import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';

export class CookieConsent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cookieAccepted: false,
      termsAccepted: false,
      consentGiven: Cookies.get('testyQuestCookieConsent') === 'accepted',
    };
  }

  handleCookieChange = () => {
    this.setState((prevState) => ({ cookieAccepted: !prevState.cookieAccepted }));
  };

  handleTermsChange = () => {
    this.setState((prevState) => ({ termsAccepted: !prevState.termsAccepted }));
  };

  handleAcceptance = () => {
    const { cookieAccepted, termsAccepted } = this.state;
    if (cookieAccepted && termsAccepted) {
      Cookies.set('testyQuestCookieConsent', 'accepted', { expires: 365 }); // Set cookie to expire in 1 year
      this.setState({ consentGiven: true });
      alert('Cookies and terms of service accepted successfully!');
    } else {
      alert('Please accept both the cookies and the terms of service to continue.');
    }
  };

  render() {
    // Only render the cookie consent if consent is not given
    if (this.state.consentGiven) {
      return null; // Don't render anything if the cookie consent is given
    }

    return (
      <div className="cookie-consent alert alert-info alert-dismissible fade show fixed-bottom" role="alert">
        <strong>Cookies Notice</strong>
        <div className="row">
          <div className="col">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="cookieaccept"
                checked={this.state.cookieAccepted}
                onChange={this.handleCookieChange}
              />
              <label className="form-check-label" htmlFor="cookieaccept">
                We use cookies to improve your experience on our website. By continuing to use this site, you agree to our use of cookies.
              </label>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="termsaccept"
                checked={this.state.termsAccepted}
                onChange={this.handleTermsChange}
              />
              <label className="form-check-label" htmlFor="termsaccept">
                You read the terms of service and by continuing to use this site, you agree to our{' '}
                <b className="btn btn-outline-secondary">
                  terms of service
                </b>
              </label>
            </div>
          </div>
          <div className="col">
            <button
              type="button"
              className="btn btn-primary position-absolute top-50 end-0 translate-middle-y me-5"
              onClick={this.handleAcceptance}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CookieConsent;
