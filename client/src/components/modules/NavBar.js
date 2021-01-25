import React, { useState, useEffect } from "react";
import "./NavBar.css";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";


const GOOGLE_CLIENT_ID = "294124002149-o7997gqc9vm3mtq4g78esqli73kvols5.apps.googleusercontent.com";


function NavBar(props) {
  const {googleId, handleLogin, handleLogout} = props;

  return (
    <div className="NavBar-container">
        {googleId ? 
        <>
            <Link to="/" className="NavBar-link">
                Roster
            </Link>
            <Link to="/dance" className="NavBar-link">
                My Dance
            </Link>
            <GoogleLogout
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Logout"
                onLogoutSuccess={handleLogout}
                onFailure={(err) => console.log(err)}
                className="NavBar-link NavBar-login"
            />
        </>
        :
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={handleLogin}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
    }
    </div>
  );
}

export default NavBar;