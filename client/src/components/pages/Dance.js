import React, { useState, useEffect } from "react";
import NameBlock from "../modules/NameBlock.js";
import PrefModal from "../modules/PrefModal.js";
import { get, post } from "../../utilities.js";
import { navigate } from "@reach/router";

import "./Dance.css";


function Dance(props) {
  const { rosteredList, dancerList, myDanceName, myDanceIndex, displayedDancer, displayedPrefs, toggleModal, addToDance, removeFromDance} = props;

  const [ roster, setRoster ] = useState(null);
  const [ copied, setCopied ] = useState(false);

  useEffect(() => {
    setRoster(rosteredList);
    console.log(rosteredList);
  }, [rosteredList])

  function copyToClipboard() {
    console.log(roster);
    const alphaRoster = roster.slice();
    alphaRoster.sort(function(a, b) {
      if (a.firstName < b.firstName){
        return -1;
      }
      if (a.firstName > b.firstName) {
        return 1;
      }
      return 0;
    });
    let rosteredListString = "";
    for (let i = 0; i < alphaRoster.length - 1; i++) {
      const nameString = alphaRoster[i].firstName + (alphaRoster[i].nickname.length !== 0 ? " (" + alphaRoster[i].nickname + ") " : " ") + alphaRoster[i].lastName;
      rosteredListString = rosteredListString + nameString + ", ";
    }
    const fi = alphaRoster.length - 1;
    const nameString = alphaRoster[fi].firstName + (alphaRoster[fi].nickname.length !== 0 ? " (" + alphaRoster[fi].nickname + ") " : " ") + alphaRoster[fi].lastName;
    rosteredListString = rosteredListString + nameString;
    navigator.clipboard.writeText(rosteredListString);
    console.log("Copied!");
    setCopied(true);
  }

  return (
    <div className="Dance-outer-container">
      {myDanceName ? <div className="Dance-title">My dance ({myDanceName})</div> : null}
      <div className="AllDances-description">Click on the umbrella and sparkle icons to view audition videos.
      <br></br>
      Dancers are sorted by how highly they pref'd your dance!
      </div>
      <div className="Dance-copyButton" onClick={() => copyToClipboard()}>
        {copied ? "Copied!" : "Copy roster to clipboard"}
      </div>
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
                  key={dancer._id+"_key"}
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
                  key={dancer._id+"_key"}
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