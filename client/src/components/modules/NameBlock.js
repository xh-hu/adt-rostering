import React, { useState, useEffect } from "react";

import "./NameBlock.css";

function NameBlock(props) {
  const {firstname, nickname, lastname, year, auditionNum, numDances, rosteredDances, comments, toggleModal, onDancePage, danceRanking, addFunction, removeFunction} = props;

  return (
    <div className="nameBlock-container">
        {onDancePage ? 
            <>
            { addFunction ? 
            <div className="nameBlock-pref-add">
                <div>{danceRanking}</div>
                <button onClick={() => addFunction(auditionNum)}>Add to Dance</button>
            </div>: 
            <div className="nameBlock-pref-add">
                <div>{danceRanking}</div>
                <button onClick={() => removeFunction(auditionNum)}>Remove from Dance</button>
            </div>
            }
            </>
            :
            <div className="nameBlock-auditionNum">
                {auditionNum}
            </div>
        }
        <div className="nameBlock-name">
            {firstname + (nickname !== "" ? " (" + nickname + ") " : " ") + lastname}
        </div>
        <div className="nameBlock-year">
            {year}
        </div>
        <div className="nameBlock-prefs">
            <button onClick={() => toggleModal(auditionNum)}>View Prefs</button>
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