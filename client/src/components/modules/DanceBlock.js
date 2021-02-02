import React, { useState, useEffect } from "react";

import "./DanceBlock.css";

function DanceBlock(props) {
  const {danceName, members} = props;

  return (
    <>
      <div className="DanceBlock-container">
        <div className="DanceBlock-danceName">
            {danceName}
        </div>
        <div className="DanceBlock-memberContainer">
            {members.map((member) => 
                <div className="DanceBlock-member">
                    {member.firstName + (member.nickname ? " (" + member.nickname + ") " : " ") + member.lastName}
                </div>
            )}
        </div>
      </div>
    </>
  );
}

export default DanceBlock;