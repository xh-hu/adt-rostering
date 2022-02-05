import React, { useEffect, useState } from "react";
import NameBlock from "../modules/NameBlock.js";
import PrefModal from "../modules/PrefModal.js";

import "./FullRoster.css";

function FullRoster(props) {
  const { allDancers, displayedDancer, displayedPrefs, toggleModal } = props;

  
  return (
    <div className="FullRoster-container">
      <div className="FullRoster-title">Full Roster</div>
      <div className="AllDances-description">Navigate to the "My Dance" tab to add members to your own dance.</div>
      <div className="FullRoster-header">
          <div>Email</div>
          <div>Quota</div>
          <div>Name</div>
          <div>Year</div>
          <div>Prefs</div>
          <div>Rostered Dances</div>
      </div>
      <div className="FullRoster-dancerBlock">
        {allDancers ? 
        allDancers.length !== 0 ? 
          allDancers.map((dancer) => 
              <NameBlock
                  key={dancer._id+"_key"}
                  dancer={dancer}
                  toggleModal={toggleModal}
              />
          ) : null
          : null
        }
      </div>
      {displayedDancer ? 
      <PrefModal
        displayedDancer={displayedDancer}
        displayedPrefs={displayedPrefs}
        toggleModal={toggleModal}
        comments={displayedDancer.comments}
      />
      : null}
    </div>
  );
}

export default FullRoster;