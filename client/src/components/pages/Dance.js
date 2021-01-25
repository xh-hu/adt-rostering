import React, { useState, useEffect } from "react";
import NameBlock from "../modules/NameBlock.js";
import { get, post } from "../../utilities.js";

import "./Dance.css";


function Dance(props) {
  const { notMyDancers, myDancers, displayedDancer, displayedPrefs, toggleModal } = props;

  const [dancerList, setDancerList] = useState(null);
  const [rosteredList, setRosteredList] = useState(null);

  useEffect(() => {
    if (notMyDancers) {
        const tempDancerList = notMyDancers.slice();
        tempDancerList.sort(function(a, b) {
            //HARDCODED TO DANCE 1
            return a.dance_1 - b.dance_1;
        })
        setDancerList(tempDancerList);
        setRosteredList(myDancers);
    }
  }, [notMyDancers]);


  function addToDance(auditionNum) {
    /* HARDCODED DANCE NUMBER */
    let addingDancer = null;
    for (var i = 0; i < dancerList.length; i++) {
      if (dancerList[i].auditionNum == auditionNum) {
        addingDancer = dancerList[i];
      }
    }
    post("/api/addToDance", {danceId: 1, danceName: "dance_1", dancer: addingDancer}).then((dancer) => {
      setRosteredList([ ... rosteredList, addingDancer]);
      const ind = dancerList.indexOf(addingDancer);
      if (ind !== -1) {
        const tempList = dancerList.slice();
        tempList.splice(ind, 1);
        setDancerList(tempList);      
      }
    });
  }

  function removeFromDance(auditionNum) {
    let removingDancer = null;
    for (var i = 0; i < rosteredList.length; i++) {
      if (rosteredList[i].auditionNum == auditionNum) {
        removingDancer = rosteredList[i];
      }
    }
    post("/api/removeFromDance", {danceId: 1, danceName: "dance_1", dancer: removingDancer}).then((dancer) => {
      const tempDancerList = [ ... dancerList, removingDancer];
      tempDancerList.sort(function(a, b) {
        //HARDCODED TO DANCE 1
        return a.dance_1 - b.dance_1;
      })
      setDancerList(tempDancerList);
      const ind = rosteredList.indexOf(removingDancer);
      if (ind !== -1) {
        const tempList = rosteredList.slice();
        tempList.splice(ind, 1);
        setRosteredList(tempList);      
      }
    });
  }

  return (
    <>
    <h1>Dance: Dance 1</h1> {/*HARDCODED*/}
    <div className="Dance-header">
          <div>Dance pref</div>
          <div>Name</div>
          <div>Year</div>
          <div>Prefs</div>
          <div>Quota</div>
          <div>Rostered Dances</div>
    </div>
    <div className="Dance-container">
        {/*HARDCODED CURRENT DANCE*/}
        {rosteredList ? rosteredList.map((dancer) => 
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
                onDancePage={true}
                danceRanking={dancer.dance_1}
                addFunction={null}
                removeFunction={removeFromDance} 
                
            />
        ) : null}
        <hr></hr>
        {dancerList ? dancerList.map((dancer) => 
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
                onDancePage={true}
                danceRanking={dancer.dance_1} 
                addFunction={addToDance}
                removeFunction={null}
            />
        ) : null}
      
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
    </>
  );
  
}

export default Dance;