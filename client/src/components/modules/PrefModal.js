import React, { useState, useEffect } from "react";

import "./PrefModal.css";

function PrefModal(props) {
  const {displayedDancer, displayedPrefs, toggleModal, comments} = props;

  return (
    <>
      <div className="PrefModal-prefModalBackground">
      </div>
      <div className="PrefModal-prefModal">
        <b>Prefs for {displayedDancer.firstName}</b>
        <hr></hr>
        <div className="PrefModal-contentArea">
            <div className="PrefModal-prefs">
                {displayedPrefs.map((pref) => 
                    <div>
                        {pref[1]}: Dance {pref[0]}
                    </div>
                )}
            </div>
            <div className="PrefModal-comments">
                <b>Comments: </b>
                {comments}
            </div>
        </div>
        <button onClick={toggleModal}>Close</button>
      </div>
    </>
  );
}

export default PrefModal;