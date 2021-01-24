import React, { useState, useEffect } from "react";
import NameBlock from "../modules/NameBlock.js";
import { get, post } from "../../utilities.js";

import "./Dance.css";


function Dance(props) {
  const { allDancers, displayedDancer, displayedPrefs, toggleModal } = props;

  const [dancerList, setDancerList] = useState(null);

  useEffect(() => {
    if (allDancers) {
        console.log(allDancers);
        const tempDancerList = allDancers;
        tempDancerList.sort(function(a, b) {
            //HARDCODED TO DANCE 1
            return a.dance_1 - b.dance_1;
        })
        setDancerList(tempDancerList);
    }
  }, [allDancers]);

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
        {/*HARDCODED DANCE RANKING*/}
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