import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";
import DanceBlock from "../modules/DanceBlock.js";

import "./AllDances.css";
import { socket } from "../../client-socket.js";


function AllDances(props) {
    const [allDances, setAllDances] = useState(null);
    
    useEffect(() => {
        if (props.allDances) {
            setAllDances(props.allDances);
        }
    }, [props.allDances]);

    return (
    <>
    <div className="AllDances-title">Dance List</div>
    <div className="AllDances-description">You may have to scroll to see all members of a dance.</div>
    <div className="AllDances-container">
        {allDances ? 
            Object.keys(allDances).map((danceName, i) =>
            <DanceBlock
                danceName={danceName}
                members={allDances[danceName]}
            />
            )
        : null
        }
        {!allDances ? 
              <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        : null}
        
    </div>
    </>
    );
  
}

export default AllDances;