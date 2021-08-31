import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";

import star from "../../public/star_icon_white.png";
import umbrella from "../../public/umbrella_icon_white.png";

import "./NameBlock.css";

function NameBlock(props) {
  const {dancer, toggleModal, onDancePage, danceRanking, addFunction, removeFunction} = props;

  const [numHipHop, setNumHipHop] = useState(0);

  useEffect(() => {
    get("/api/hiphopCount", { dancerId: dancer._id }).then((hiphopCount) => {
        setNumHipHop(hiphopCount.hiphopCount);
    })
  }, [dancer])

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
                {dancer.emailAddr}
            </div>
        }
        <div className="nameBlock-numDancesRequested">
            <>
            {dancer.rosteredDances ? dancer.rosteredDances.length + "/" + dancer.numDances : null}
            {dancer.rosteredDances.length > dancer.numDances ?
                <span title="Over requested quota" className="nameBlock-warning">
                 !
                </span>
                : null}
            </>
        </div>
        <div className="nameBlock-name">
            {dancer.firstName + (dancer.nickname != null && dancer.nickname !== "" ? " (" + dancer.nickname + ") " : " ") + dancer.lastName + " #" + dancer.auditionNum}
            {dancer.trad_vid !== '' ? 
            <>
                <a href={dancer.trad_vid} alt="trad" title="trad video" target="_blank"><img src={umbrella} /></a>
            </>
            : null
            }
            {dancer.hiphop_vid !== '' ? 
            <>
                <a href={dancer.hiphop_vid} alt="hiphop" title="hiphop video" target="_blank"><img src={star} /></a>
            </>
            : null
            }
        </div>
        <div className="nameBlock-year">
            {dancer.year}
        </div>
        <div className="nameBlock-prefs">
            <button onClick={() => toggleModal(dancer)}>View Prefs</button>
        </div>
        <div className="nameBlock-rosteredDancesContainer">
            <>
            {dancer.rosteredDances ? 
            dancer.rosteredDances.slice(0, dancer.rosteredDances.length-1).map((dance) => 
                dance + ", "
            ):
            null}
            {dancer.rosteredDances[dancer.rosteredDances.length-1]}
            {numHipHop > 3 ?
                <span title="More than 3 hiphop dances!" className="nameBlock-warning">
                 !
                </span>
                : null}
            </>
        </div>
    </div>
  );
}

export default NameBlock;