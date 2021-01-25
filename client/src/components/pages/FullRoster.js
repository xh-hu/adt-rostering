import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";
import NameBlock from "../modules/NameBlock.js";

import "./FullRoster.css";

function FullRoster(props) {
  const { allDancers, displayedDancer, displayedPrefs, toggleModal } = props;

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
                rosteredDances={dancer.rosteredDances}
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