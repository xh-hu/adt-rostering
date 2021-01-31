import React, { useState, useEffect } from "react";
import NameBlock from "../modules/NameBlock.js";
import PrefModal from "../modules/PrefModal.js";
import { get, post } from "../../utilities.js";
import { navigate } from "@reach/router";

import "./Dance.css";


function Dance(props) {
  const { rosteredList, dancerList, myDanceName, myDanceIndex, displayedDancer, displayedPrefs, toggleModal, addToDance, removeFromDance} = props;

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