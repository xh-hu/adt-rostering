import React from "react";

import "./NameBlock.css";

function NameBlock(props) {
  const {firstname, nickname, lastname, year, auditionNum, numDances, rosteredDances} = props;

  function showModal() {

  }

  return (
    <div className="nameBlock-container">
        <div className="nameBlock-auditionNum">
            {auditionNum}
        </div>
        <div className="nameBlock-name">
            {firstname + (nickname !== "" ? " (" + nickname + ") " : " ") + lastname}
        </div>
        <div className="nameBlock-year">
            {year}
        </div>
        <div className="nameBlock-prefs">
            <button>View Prefs</button>
        </div>
        <div className="nameBlock-numDancesRequested">
            {rosteredDances.length}/{numDances}
        </div>
        <div className="nameBlock-rosteredDancesContainer">
            {rosteredDances.map((dance) => 
                <div>
                    {dance}
                </div>
            )}
        </div>
    </div>
  );
}

export default NameBlock;