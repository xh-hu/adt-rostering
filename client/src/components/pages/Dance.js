import React, { useState, useEffect } from "react";
import NameBlock from "../modules/NameBlock.js";
import PrefModal from "../modules/PrefModal.js";
import { get, post } from "../../utilities.js";

import "./Dance.css";


function Dance(props) {
  const { notMyDancers, myDanceName, myDanceIndex, myDancers, displayedDancer, displayedPrefs, toggleModal } = props;

  const [dancerList, setDancerList] = useState(null);
  const [rosteredList, setRosteredList] = useState(null);

  useEffect(() => {
    if (notMyDancers && myDanceIndex) {
        const tempDancerList = notMyDancers.slice();
        tempDancerList.sort(function(a, b) {
            return a[myDanceIndex] - b[myDanceIndex];
        })
        setDancerList(tempDancerList);
        setRosteredList(myDancers);
    }
  }, [notMyDancers]);


  function addToDance(addingDancer) {
    post("/api/addToDance", {danceId: myDanceIndex, danceName: myDanceName, dancer: addingDancer}).then((f) => {
      get("/api/getDancer", {dancerId: addingDancer._id}).then((dancer) => {
      setRosteredList([ ... rosteredList, dancer]);
      const ind = dancerList.indexOf(addingDancer);
      if (ind !== -1) {
        const tempList = dancerList.slice();
        tempList.splice(ind, 1);
        setDancerList(tempList);      
        }
      });
    });
  }

  function removeFromDance(removingDancer) {
    post("/api/removeFromDance", {danceId: myDanceIndex, danceName: myDanceName, dancer: removingDancer}).then((f) => {
      get("/api/getDancer", {dancerId: removingDancer._id}).then((dancer) => {
        const tempDancerList = [ ... dancerList, dancer];
        tempDancerList.sort(function(a, b) {
          return a[myDanceIndex] - b[myDanceIndex];
        })
        setDancerList(tempDancerList);
        const ind = rosteredList.indexOf(removingDancer);
        if (ind !== -1) {
          const tempList = rosteredList.slice();
          tempList.splice(ind, 1);
          setRosteredList(tempList);      
        }
      });
    });
  }

  return (
    <div className="Dance-outer-container">
      {myDanceName ? <div className="Dance-title">My dance ({myDanceName})</div> : null}
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
                  dancer={dancer}
                  toggleModal={toggleModal}
                  onDancePage={true}
                  danceRanking={dancer[myDanceIndex]}
                  addFunction={null}
                  removeFunction={removeFromDance} 
                  
              />
          ) : null}
          <hr></hr>
          {dancerList ? dancerList.map((dancer) => 
              <NameBlock
                  dancer={dancer}
                  toggleModal={toggleModal}
                  onDancePage={true}
                  danceRanking={dancer[myDanceIndex]} 
                  addFunction={addToDance}
                  removeFunction={null}
              />
          ) : null}
        
        {displayedDancer ? 
        <PrefModal
          displayedDancer={displayedDancer}
          displayedPrefs={displayedPrefs}
          toggleModal={toggleModal}
          comments={displayedDancer.comments}
        />
        : null}
      </div>
    </div>
  );
  
}

export default Dance;