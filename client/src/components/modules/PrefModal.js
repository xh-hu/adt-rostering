import React, { useState, useEffect } from "react";
import { get } from "../../utilities.js";

import "./PrefModal.css";

function PrefModal(props) {
  const {displayedDancer, displayedPrefs, toggleModal, comments} = props;
  const [danceIndexToName, setDanceIndexToName] = useState(null);

  useEffect(() => {
    if (!danceIndexToName) {
      get("/api/getDanceIndexToName").then((data) => {
        setDanceIndexToName(data);
      })
    }
  })

  // console.log(rejectedDanceMap?.get(displayedDancer))
  // console.log(displayedDancer.rejectedDances)

  return (
    <>
      <div className="PrefModal-prefModalBackground">
      </div>
      {!danceIndexToName ? 
          <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        : 
      <div className="PrefModal-prefModal">
        <b>Prefs for {displayedDancer.firstName} ({displayedDancer.emailAddr})</b>
        <hr></hr>
        <div className="PrefModal-contentArea">
            <div className="PrefModal-prefs">
                {danceIndexToName ? 
                displayedPrefs.map((pref) => 
                    <div className="PrefModal-individualPref">
                        {pref[1]}: {danceIndexToName["dance_" + pref[0]]} {displayedDancer.rejectedDances?.includes(danceIndexToName["dance_" + pref[0]]) ? "(X)" : ""}
                    </div>
                ) : null
              }
            </div>
            <div className="PrefModal-comments">
                <b>Comments: </b>
                {comments}
            </div>
        </div>
        <button onClick={toggleModal}>Close</button>
      </div>
      }
    </>
  );
}

export default PrefModal;