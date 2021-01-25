import React, { useState, useEffect, useLayoutEffect } from "react";
import { Router, Location } from "@reach/router";
import { get, post } from "../utilities.js";
import NotFound from "./pages/NotFound.js";
import NavBar from "./modules/NavBar.js";
import Dance from "./pages/Dance.js";
import Admin from "./pages/Admin.js";
import FullRoster from "./pages/FullRoster.js";

import "../utilities.css";
import "./App.css";

import OnRouteChangeWorker from "./OnRouteChangeWorker.js";

const OnRouteChange = ( { action } ) => (
  <Location>
    {({ location }) => <OnRouteChangeWorker location={location} action={action} />}
  </Location>
)


function App(props) {
  const [googleId, setGoogleId] = useState(null);
  const [allDancers, setAllDancers] = useState([]);
  const [modalOpen, toggleModalState] = useState(false);
  const [displayedDancer, setDancer] = useState(null);
  const [displayedPrefs, setPrefs] = useState([]);
  const [myDancers, setMyDancers] = useState(null);
  const [notMyDancers, setNotMyDancers] = useState(null);


  useLayoutEffect(() => {
    console.log(window.location.pathname)
    window.scrollTo(0, 0);
  }, [window.location.pathname]);

  useEffect(()=> {
    async function getData() {
        get("/api/allDancers").then((allDancerData) => {
            setAllDancers(allDancerData);
            /**Hardcoded ID **/
            get("/api/getDance", {danceId: 1}).then((myDancerData) => {
              console.log(myDancerData);
              setMyDancers(myDancerData);
              const tempList = [];
              for (var i = 0; i < allDancerData.length; i++) {
                let isMyDancer = false;
                for (var j = 0; j < myDancerData.length; j++) {
                  if (allDancerData[i]._id == myDancerData[j]._id) {
                    isMyDancer = true;
                    break;
                  }
                }
                if (!isMyDancer) {
                  tempList.push(allDancerData[i]);
                }
              }
              console.log(tempList);
              setNotMyDancers(tempList);
          });
        });
    }

    if (allDancers.length == 0 && googleId) {
        getData();
    }
    else {
      get("/api/whoami").then((user) => {
        if (user.email) {
          // they are registed in the database, and currently logged in.
          setGoogleId(user.email);
        }
      });
    }
  }, [allDancers, googleId]);

  function handleLogin(res) {
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      get("/api/validChoreog", { googleid: res.profileObj.googleId, gmail: res.profileObj.email }).then((result) => {
        setGoogleId(res.profileObj.email);
        console.log("Welcome choreographer " + res.profileObj.name);
      })
    });
  };

  function handleLogout() {
    setGoogleId(null);
    post("/api/logout");
  };

  function toggleModal(auditionNum) {
    if (modalOpen) {
        toggleModalState(false);
        setDancer(null);
        setPrefs([]);
    }
    else {
        toggleModalState(true);
        for (var i = 0; i < allDancers.length; i++) {
          const dancer = allDancers[i];
          let tempPrefs = [];
          if (dancer.auditionNum == auditionNum) {
              setDancer(dancer);
              tempPrefs = [
                  [0, dancer.dance_0],
                  [1, dancer.dance_1],
                  [2, dancer.dance_2],
                  [3, dancer.dance_3],
                  [4, dancer.dance_4],
                  [5, dancer.dance_5],
                  [6, dancer.dance_6],
                  [7, dancer.dance_7],
                  [8, dancer.dance_8],
                  [9, dancer.dance_9],
                  [10, dancer.dance_10],
                  [11, dancer.dance_11],
                  [12, dancer.dance_12],
                  [13, dancer.dance_13],
                  [14, dancer.dance_14],
                  [15, dancer.dance_15],
                  [16, dancer.dance_16],
                  [17, dancer.dance_17]
              ];
              tempPrefs.sort(function (a, b) {
                  return a[1] - b[1];
              })
              setPrefs(tempPrefs);
          }
        }
    }
  }



    return (
      <>
      
      <NavBar 
        googleId={googleId}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <div className="appContainer">
        {googleId ? (
          <>
            <Router>
            <FullRoster 
              path="/"
              allDancers={allDancers}
              displayedDancer={displayedDancer}
              displayedPrefs={displayedPrefs}
              toggleModal={toggleModal}
            /> 
            { notMyDancers && myDancers ? 
            <Dance path="/dance"
              notMyDancers={notMyDancers}
              myDancers={myDancers}
              displayedDancer={displayedDancer}
              displayedPrefs={displayedPrefs}
              toggleModal={toggleModal} />
            : null} 
            <Admin path="/admin" />
            <NotFound default />
            </Router>
            <OnRouteChange action={() => { window.scrollTo(0, 0)}} />
        </>
          ) : (
            null
          )}
      </div>
      
      </>
    );
}

export default App;
