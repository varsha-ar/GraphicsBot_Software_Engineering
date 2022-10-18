import React from 'react';
import "./header/header.css";


class Login extends React.Component {

  componentDidMount = () => { 
    const oauthurl = `${process.env.REACT_APP_OAUTH_URL}&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}&scope=${process.env.REACT_APP_SCOPE}&state=${process.env.REACT_APP_STATE}`;
    window.open(
      oauthurl, "_self"
    );

  };


  render() {
    return (
      <div>

      </div>

    )
  };
}


export default Login;