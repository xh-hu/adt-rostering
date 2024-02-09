import React, { useState, useEffect } from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";


const GOOGLE_CLIENT_ID = "7112847294-5v026crn1ac038njg41v8a4e6obaeaae.apps.googleusercontent.com";



function NavBar(props) {
  const {googleId, handleLogin, handleLogout, danceName, danceIndex, setMyDanceName, setMyDanceIndex, allDanceNames, allDanceIndices} = props;
  
  const [pathName, setPathName] = useState("/");

  const isActive = () => {
    setPathName(window.location.pathname);
  }

  const switchDance = () => {
    let index = allDanceNames.indexOf(danceName)
    setMyDanceName(allDanceNames[(index+1) % allDanceNames.length])
    setMyDanceIndex(allDanceIndices[(index+1) % allDanceNames.length])
  }

  return (
    <div className="NavBar-container">
        {googleId ? 
        <>
            <div className="NavBar-linksContainer">
              <div className="NavBar-linkBlock">
                <Link getProps={isActive} to="/" className="NavBar-link">
                    Roster
                </Link>
                <div>{pathName === "/" ? "^" : null}</div>
              </div>
              <div className="NavBar-linkBlock">
                <Link getProps={isActive} to="/allDances" className="NavBar-link">
                    All Dances
                </Link>
                <div>{pathName === "/allDances" ? "^" : null}</div>
              </div>
              <div className="NavBar-linkBlock">
                <Link getProps={isActive} to="/dance" className="NavBar-link">
                    My Dance
                </Link>
                <div>{pathName === "/dance" ? "^" : null}</div>
              </div>
              <div className="NavBar-linkBlock">
                <Link getProps={isActive} to="/scheduling" className="NavBar-link">
                    Scheduling
                </Link>
                <div>{pathName === "/scheduling" ? "^" : null}</div>
              </div>
            </div>
            <div className="NavBar-rightBlock">
              {allDanceNames && allDanceNames.length > 1 ? 
              <div className="NavBar-rightLinkBlock">
                  Viewing: {danceName} 
                  <button onClick={switchDance}>switch</button>
              </div>
              : null}
            </div>
        </> : null }
        <div className="NavBar-link NavBar-login">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {googleId ? (
              <button
                onClick={() => {
                  googleLogout();
                  handleLogout();
                }}
              >
                Logout
              </button>
            ) : (
              <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
            )}
          </GoogleOAuthProvider>
        </div>
    </div>
  );
}

export default NavBar;