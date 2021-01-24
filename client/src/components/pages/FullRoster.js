import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";
import NameBlock from "../modules/NameBlock.js";

import "./FullRoster.css";

function FullRoster(props) {
  const {  } = props;

  const [allDancers, setAllDancers] = useState([]);

  useEffect(()=> {

    async function getData() {
        get("/api/allDancers").then((data) => {
            console.log(data);
            setAllDancers(data);
        });
    }
    if (allDancers.length == 0) {
        getData();
    }
  }, [allDancers]);

  return (
    <div>
      <h1>Roster</h1>
      <div className="FullRoster-header">
          <div>Audition #</div>
          <div>Name</div>
          <div>Year</div>
          <div>Prefs</div>
          <div>Quota</div>
          <div>Rostered Dances</div>
      </div>
      {allDancers.length !== 0 ? 
        allDancers.map((dancer) => 
            <NameBlock
                firstname={dancer.firstName}
                nickname={dancer.nickname}
                lastname={dancer.lastName}
                year={dancer.year}
                auditionNum={dancer.auditionNum}
                numDances={dancer.numDances}
                rosteredDances={[]}
            />
        ) : null
      }
    </div>
  );
}

export default FullRoster;