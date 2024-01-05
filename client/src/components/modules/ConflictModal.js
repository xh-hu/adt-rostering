import React, { useState, useEffect } from "react";

import "./ConflictModal.css";

function ConflictModal(props) {
  const {conflicts, toggleConflict} = props;

  // console.log(rejectedDanceMap?.get(displayedDancer))
  // console.log(displayedDancer.rejectedDances)

  return (
    <>
      <div className="ConflictModal-conflictModalBackground">
      </div>
      {<div className="ConflictModal-conflictModal">
        <b>Conflicts</b>
        <hr></hr>
        <div className="ConflictModal-contentArea">
            <div className="ConflictModal-conflicts">
                {conflicts.join("\n")}
            </div>
        </div>
        <button onClick={toggleConflict}>Close</button>
      </div>
      }
    </>
  );
}

export default ConflictModal;