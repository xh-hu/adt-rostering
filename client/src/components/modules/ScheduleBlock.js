import React, { useState, useEffect } from "react";
import ConflictModal from "../modules/ConflictModal.js";
import "./ScheduleBlock.css";

function ScheduleBlock(props) {
  const {day, time, location, conflicts, claimers, claimFunction, choreogName, toggleConflict, displayedConflicts} = props;
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
      if (claimers.includes(choreogName)) {
          setClaimed(true);
      }
      else {
          setClaimed(false);
      }
  })

  return (
    <>
      <div className="ScheduleBlock-container">
          <div>{time} : {location}</div>
          {claimers.length > 0 ? <div>Claimed by: {claimers.join(", ")}</div> : null}
          {conflicts.length === 0 ? 
            <div className="ScheduleBlock-claimButtonNoConflict" onClick={() => claimFunction(day, time, location, claimers)}>
                <span title={"No conflicts!"}>{claimed ? "Unclaim" : "Claim"}</span>
            </div>
            : 
            <div className="ScheduleBlock-claimButtonWithConflict" onClick={() => claimFunction(day, time, location, claimers)}>
                <span title={conflicts.join("\n")}>{claimed ? "Unclaim" : "Claim (!)"}</span>
            </div>
          }
          <div className="viewConflictButton" onClick={() => toggleConflict(day, time)}>
            <span>Conflicts</span>
          </div>
      </div>
      {displayedConflicts ? 
        <ConflictModal
          conflicts={displayedConflicts}
          toggleConflict={toggleConflict}
        />
        : null}
    </>
  );
}

export default ScheduleBlock;