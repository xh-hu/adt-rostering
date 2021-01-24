import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";
import NameBlock from "../modules/NameBlock.js";

import "./FullRoster.css";

function FullRoster(props) {
  const {  } = props;

  const [allDancers, setAllDancers] = useState([]);
  const [modalOpen, toggleModalState] = useState(false);
  const [displayedDancer, setDancer] = useState(null);
  const [displayedPrefs, setPrefs] = useState([]);

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

  return (
    <div className="FullRoster-container">
      <h1>Roster</h1>
      <div className="FullRoster-header">
          <div>Audition #</div>
          <div>Name</div>
          <div>Year</div>
          <div>Prefs</div>
          <div>Quota</div>
          <div>Rostered Dances</div>
      </div>
      {allDancers.length !== 0 ? 
        allDancers.map((dancer) => 
            <NameBlock
                firstname={dancer.firstName}
                nickname={dancer.nickname}
                lastname={dancer.lastName}
                year={dancer.year}
                auditionNum={dancer.auditionNum}
                numDances={dancer.numDances}
                rosteredDances={[]}
                comments={dancer.comments}
                toggleModal={toggleModal}
            />
        ) : null
      }
      {displayedDancer ? 
      <>
      <div className="FullRoster-prefModalBackground">
      </div>
      <div className="FullRoster-prefModal">
        <b>Prefs for {displayedDancer}</b>
        <hr></hr>
        {displayedPrefs.map((pref) => 
            <div>
                {pref[1]}: Dance {pref[0]}
            </div>
        )}
        <button onClick={toggleModal}>Close</button>
      </div>
      </>
      : null}
    </div>
  );
}

export default FullRoster;