import React, { useState, useEffect } from "react";
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
  const [myDanceName, setMyDanceName] = useState(null);
  const [myDanceIndex, setMyDanceIndex] = useState(null);

  const [allDancers, setAllDancers] = useState([]);
  const [modalOpen, toggleModalState] = useState(false);
  const [displayedDancer, setDancer] = useState(null);
  const [displayedPrefs, setPrefs] = useState([]);
  const [myDancers, setMyDancers] = useState(null);
  const [notMyDancers, setNotMyDancers] = useState(null);

  useEffect(()=> {
    async function getData() {
        get("/api/allDancers").then((allDancerData) => {
            setAllDancers(allDancerData);
            if (myDanceIndex) {
              get("/api/getDance", {danceId: myDanceIndex}).then((myDancerData) => {
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
                setNotMyDancers(tempList);
            });
            }
            
        });
    }

    if (allDancers.length == 0 && googleId) {
        getData();
    }
    else {
      get("/api/whoami").then((user) => {
        if (user.email) {
          get("/api/validChoreog", { googleid: user.googleid, gmail: user.email }).then((choreog) => {
            setGoogleId(user.email);
            setMyDanceName(choreog.dance_name);
            setMyDanceIndex(choreog.dance_index);
          })
        }
      });
    }
  }, [allDancers, googleId, myDanceIndex, myDanceName]);

  function handleLogin(res) {
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      get("/api/validChoreog", { googleid: res.profileObj.googleId, gmail: res.profileObj.email }).then((choreog) => {
        setGoogleId(res.profileObj.email);
        console.log("Welcome choreographer " + res.profileObj.name);
        setMyDanceName(choreog.dance_name);
        setMyDanceIndex(choreog.dance_index);
      })
    });
  };

  function handleLogout() {
    setGoogleId(null);
    post("/api/logout");
  };

  function toggleModal(dancer) {
    if (modalOpen) {
        toggleModalState(false);
        setDancer(null);
        setPrefs([]);
    }
    else {
        toggleModalState(true);
        let tempPrefs = [];
        setDancer(dancer);
        tempPrefs = [ /** Change this to have actual dance names */
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
            { notMyDancers && myDancers && myDanceName && myDanceIndex ? 
            <Dance path="/dance"
              notMyDancers={notMyDancers}
              myDanceName={myDanceName}
              myDanceIndex={myDanceIndex}
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
