import React, { useState, useEffect } from "react";

import "./DanceBlock.css";

function DanceBlock(props) {
  const {danceName, members} = props;

  return (
    <>
      <div className="DanceBlock-container">
        <div className="DanceBlock-danceName">
            <div>{danceName}</div>
            <div>{members.length}</div>
        </div>
        <hr></hr>
        <div className="DanceBlock-memberContainer">
            {members.length !== 0 ? members.map((member) => 
                <div className="DanceBlock-member">
                    {member.firstName + (member.nickname ? " (" + member.nickname + ") " : " ") + member.lastName + " (" + member.year + ")"}
                </div>
            ) :
            <div>No members yet!</div>
            }
        </div>
      </div>
    </>
  );
}

export default DanceBlock;