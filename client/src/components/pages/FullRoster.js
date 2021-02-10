import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities.js";
import NameBlock from "../modules/NameBlock.js";
import PrefModal from "../modules/PrefModal.js";

import "./FullRoster.css";

function FullRoster(props) {
  const { allDancers, displayedDancer, displayedPrefs, toggleModal } = props;

  const [sortedDancers, setSortedDancers] = useState(null);

  useEffect(() => {
    if (allDancers.length > 0 && !sortedDancers) {
      const tempDancers = allDancers.slice();
      console.log(tempDancers);
      tempDancers.sort(function(a, b) {
        let a_load;
        let b_load;
        try {
          a_load = a.rosteredDances.length;
        }
        catch {
          a_load = 0;
        }
        try {
          b_load = b.rosteredDances.length;
        }
        catch {
          b_load = 0;
        }
        return a_load - b_load;
        
      })
      setSortedDancers(tempDancers);
    }
  }, [allDancers])
  

  return (
    <div className="FullRoster-container">
      <div className="FullRoster-title">Full Roster</div>
      <div className="AllDances-description">Navigate to the "My Dance" tab to add members to your own dance.</div>
      <div className="FullRoster-header">
          <div>Audition #</div>
          <div>Name</div>
          <div>Year</div>
          <div>Prefs</div>
          <div>Quota</div>
          <div>Rostered Dances</div>
      </div>
      <div className="FullRoster-dancerBlock">
        {sortedDancers ? 
        sortedDancers.length !== 0 ? 
          sortedDancers.map((dancer) => 
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