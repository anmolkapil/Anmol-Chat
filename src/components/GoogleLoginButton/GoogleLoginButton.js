import './GoogleLoginButton.css';

const GoogleLoginButton = ({ handleClick }) => {
  return (
    <div className="g-sign-in-button" onClick={handleClick}>
      <div className="content-wrapper">
        <div className="logo-wrapper">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="google logo"
          />
        </div>
        <span className="text-container">
          <span>Sign in with Google</span>
        </span>
      </div>
    </div>
  );
};

export default GoogleLoginButton;
