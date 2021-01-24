import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import { get, post } from "../utilities.js";
import NotFound from "./pages/NotFound.js";
import Login from "./pages/Login.js";
import Dance from "./pages/Dance.js";
import Admin from "./pages/Admin.js";
import FullRoster from "./pages/FullRoster.js";

import "../utilities.css";
import "./App.css";

function App(props) {
  const [allDancers, setAllDancers] = useState([]);
  const [modalOpen, toggleModalState] = useState(false);
  const [displayedDancer, setDancer] = useState(null);
  const [displayedPrefs, setPrefs] = useState([]);

  useEffect(()=> {
    async function getData() {
        get("/api/allDancers").then((data) => {
            console.log(data);
            setAllDancers(data);
        });
    }
    if (allDancers.length == 0) {
        getData();
    }
  }, [allDancers]);

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
              setDancer(dancer.firstName);
              console.log(dancer.firstName);
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
              setDancer(dancer.firstName);
              console.log(dancer.firstName);
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
      <div className="appContainer">
        <Router>
          <Login path="/" />
          <Dance path="/dance"
            allDancers={allDancers}
            displayedDancer={displayedDancer}
            displayedPrefs={displayedPrefs}
            toggleModal={toggleModal} />
          <FullRoster 
            path="/roster"
            allDancers={allDancers}
            displayedDancer={displayedDancer}
            displayedPrefs={displayedPrefs}
            toggleModal={toggleModal}
          /> 
          <Admin path="/admin" />
          <NotFound default />
        </Router>
      </div>
    );
}

export default App;
