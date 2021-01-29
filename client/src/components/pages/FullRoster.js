import React, { useLayoutEffect } from "react";
import { get, post } from "../../utilities.js";
import NameBlock from "../modules/NameBlock.js";
import PrefModal from "../modules/PrefModal.js";

import "./FullRoster.css";

function FullRoster(props) {
  const { allDancers, displayedDancer, displayedPrefs, toggleModal } = props;
  


  return (
    <div className="FullRoster-container">
      <div className="FullRoster-title">Full Roster</div>
      <div className="FullRoster-header">
          <div>Audition #</div>
          <div>Name</div>
          <div>Year</div>
          <div>Prefs</div>
          <div>Quota</div>
          <div>Rostered Dances</div>
      </div>
      <div className="FullRoster-dancerBlock">
        {allDancers.length !== 0 ? 
          allDancers.map((dancer) => 
              <NameBlock
                  dancer={dancer}
                  toggleModal={toggleModal}
              />
          ) : null
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