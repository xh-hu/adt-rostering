import React, { useState, useEffect } from "react";

import "./NameBlock.css";

function NameBlock(props) {
  const {dancer, toggleModal, onDancePage, danceRanking, addFunction, removeFunction} = props;

  return (
    <div className="nameBlock-container">
        {onDancePage ? 
            <>
            { addFunction ? 
            <div className="nameBlock-pref-add">
                <div>{danceRanking}</div>
                <button onClick={() => {
                    addFunction(dancer)}}>Add to Dance</button>
            </div>: 
            <div className="nameBlock-pref-remove">
                <div>{danceRanking}</div>
                <button onClick={() => removeFunction(dancer)}>Remove from Dance</button>
            </div>
            }
            </>
            :
            <div className="nameBlock-auditionNum">
                {dancer.auditionNum}
            </div>
        }
        <div className="nameBlock-name">
            {dancer.firstName + (dancer.nickname !== "" ? " (" + dancer.nickname + ") " : " ") + dancer.lastName}
        </div>
        <div className="nameBlock-year">
            {dancer.year}
        </div>
        <div className="nameBlock-prefs">
            <button onClick={() => toggleModal(dancer)}>View Prefs</button>
        </div>
        <div className="nameBlock-numDancesRequested">
            {dancer.rosteredDances ? dancer.rosteredDances.length + "/" + dancer.numDances : null}
        </div>
        <div className="nameBlock-rosteredDancesContainer">
            {dancer.rosteredDances ? 
            dancer.rosteredDances.map((dance) => 
                dance + " "
            ):
            null}
        </div>
    </div>
  );
}

export default NameBlock;