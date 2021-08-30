import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";
import ScheduleBlock from "../modules/ScheduleBlock";

import "./Scheduling.css";
import { socket } from "../../client-socket.js";


function Scheduling(props) {
  const { rosteredList, choreogName } = props;
  const [finished, setFinished] = useState(false);
  const [timeslots, setTimeslots] = useState([]);
  
  const [conflicts] = useState({"sunday": {"10a": [], "11a": [], "12p": [], "1p": [], "2p": [], "3p": [], "4p": [], "5p": [], "6p": [], "7p": [], "8p": [], "9p": [], "10p": []},
    "monday": {"5p": [], "6p": [], "7p": [], "8p": [], "9p": [], "10p": []}, 
    "tuesday": {"5p": [], "6p": [], "7p": [], "8p": [], "9p": [], "10p": []}, 
    "wednesday": {"5p": [], "6p": [], "7p": [], "8p": [], "9p": [], "10p": []}, 
    "thursday": {"5p": [], "6p": [], "7p": [], "8p": [], "9p": [], "10p": []}, 
    "friday": {"5p": [], "6p": [], "7p": [], "8p": [], "9p": [], "10p": []},
    "saturday": {"10a": [], "11a": [], "12p": [], "1p": [], "2p": [], "3p": [], "4p": [], "5p": [], "6p": [], "7p": [], "8p": [], "9p": [], "10p": []}});
    
  useEffect(() => {
    async function getConflicts() {
      for (let i = 0; i < rosteredList.length; i++) {
          const dancer = rosteredList[i];
          const dancerName = dancer.firstName + (dancer.nickname !== "" ? " (" + dancer.nickname + ") " : " ") + dancer.lastName;
          const sundayConflicts = dancer.sunday.length !== 0 ? dancer.sunday.split(" ") : [];
          for (let j = 0; j < sundayConflicts.length; j++) {
              const c = sundayConflicts[j];
              conflicts["sunday"][c] = conflicts["sunday"][c].concat([dancerName])
          }
          const mondayConflicts = dancer.monday.length !== 0 ? dancer.monday.split(" "): [];
          for (let j = 0; j < mondayConflicts.length; j++) {
              const c = mondayConflicts[j];
              conflicts["monday"][c] = conflicts["monday"][c].concat([dancerName])
          }
          const tuesdayConflicts = dancer.tuesday.length !== 0 ? dancer.tuesday.split(" "): [];
          for (let j = 0; j < tuesdayConflicts.length; j++) {
              const c = tuesdayConflicts[j];
              conflicts["tuesday"][c] = conflicts["tuesday"][c].concat([dancerName])
          }
          const wednesdayConflicts = dancer.wednesday.length !== 0 ? dancer.wednesday.split(" ") : [];
          for (let j = 0; j < wednesdayConflicts.length; j++) {
              const c = wednesdayConflicts[j];
              conflicts["wednesday"][c] = conflicts["wednesday"][c].concat([dancerName])
          }
          const thursdayConflicts = dancer.thursday.length !== 0 ? dancer.thursday.split(" ") : [];
          for (let j = 0; j < thursdayConflicts.length; j++) {
              const c = thursdayConflicts[j];
              conflicts["thursday"][c] = conflicts["thursday"][c].concat([dancerName])
          }
          const fridayConflicts = dancer.friday.length !== 0 ? dancer.friday.split(" ") : [];
          for (let j = 0; j < fridayConflicts.length; j++) {
              const c = fridayConflicts[j];
              conflicts["friday"][c] = conflicts["friday"][c].concat([dancerName])
          }
          const saturdayConflicts = dancer.saturday.length !== 0 ? dancer.saturday.split(" ") : [];
          for (let j = 0; j < saturdayConflicts.length; j++) {
              const c = saturdayConflicts[j];
              conflicts["saturday"][c] = conflicts["saturday"][c].concat([dancerName])
          }
      }
      setFinished(true);
    }
    if (rosteredList != null && !finished) {
        getConflicts();
        get("/api/timeslots").then((res) => {
            setTimeslots(res);
        })
    }
    
  }, [rosteredList, conflicts, timeslots])

  useEffect(() => {
    socket.once("claimSlot", (data) => {
        console.log(data.name + " claimed " + data.slot.day + ", " + data.slot.time + ", " + data.slot.location);
        const updatedClaimers = data.slot.claimers;
        const updatedTimeslots = timeslots.slice();
        for (let i = 0; i < timeslots.length; i++) {
            if (updatedTimeslots[i]["day"] == data.slot.day && updatedTimeslots[i]["time"] == data.slot.time && updatedTimeslots[i]["location"] == data.slot.location) {
                updatedTimeslots[i]["claimers"] = updatedClaimers;
            }
        }
        setTimeslots(updatedTimeslots);
    })
    return () => {
        socket.off("claimSlot");
    }
  })

  useEffect(() => {
    socket.once("unclaimSlot", (data) => {
        console.log(data.name + " unclaimed " + data.slot.day + ", " + data.slot.time + ", " + data.slot.location);
        const updatedClaimers = data.slot.claimers;
        console.log(updatedClaimers);
        const updatedTimeslots = timeslots.slice();
        for (let i = 0; i < timeslots.length; i++) {
            if (updatedTimeslots[i]["day"] == data.slot.day && updatedTimeslots[i]["time"] == data.slot.time && updatedTimeslots[i]["location"] == data.slot.location) {
                updatedTimeslots[i]["claimers"] = updatedClaimers;
            }
        }
        setTimeslots(updatedTimeslots);
    })
    return () => {
        socket.off("unclaimSlot");
    }
  })

  function claimSlot(dayString, timeString, locationString, claimers) {
      if (!claimers.includes(choreogName)) {
        post("/api/claimSlot", {choreogName: choreogName, day: dayString, time: timeString, location: locationString}).then((res) => {
            console.log("claimed");
        })
      }
      else {
        post("/api/unclaimSlot", {choreogName: choreogName, day: dayString, time: timeString, location: locationString}).then((res) => {
            console.log("UNclaimed");
        })
      }
  }

  return (
    <div className="Scheduling-container">
       <div className="Scheduling-title">
           Time and Room Selection
        </div> 
        <div className="Scheduling-description">Claim room/times for your dance.
      Green claim button means no conflicts, and orange button means at least one dancer in your rostered list has a conflict.
      <br></br>
      <br></br>
      Mouse over the orange claim button to see the dancers which have conflicts.
      </div>
        {timeslots.length > 0 && finished ? 
        <div className="Scheduling-calendar-section">
        <div className="Scheduling-calendar-column">
            <div>Sunday</div>
            {timeslots.map(slot => slot["day"] === "sunday" ?
            <ScheduleBlock
                day={slot["day"]}
                time={slot["time"]}
                location={slot["location"]}
                conflicts={conflicts[slot["day"]][slot["time"]]}
                claimers={slot["claimers"]}
                claimFunction={claimSlot}
                choreogName={choreogName}
            /> : 
            null
            )}
        </div>
        <div className="Scheduling-calendar-column">
            <div>Monday</div>
            {timeslots.map(slot => slot["day"] === "monday" ?
            <ScheduleBlock
                day={slot["day"]}
                time={slot["time"]}
                location={slot["location"]}
                conflicts={conflicts[slot["day"]][slot["time"]]}
                claimers={slot["claimers"]}
                claimFunction={claimSlot}
                choreogName={choreogName}
            /> : 
            null
            )}
        </div>
        <div className="Scheduling-calendar-column">
            <div>Tuesday</div>
            {timeslots.map(slot => slot["day"] === "tuesday" ?
            <ScheduleBlock
                day={slot["day"]}
                time={slot["time"]}
                location={slot["location"]}
                conflicts={conflicts[slot["day"]][slot["time"]]}
                claimers={slot["claimers"]}
                claimFunction={claimSlot}
                choreogName={choreogName}
            /> : 
            null
            )}
        </div>
        <div className="Scheduling-calendar-column">
            <div>Wednesday</div>
            {timeslots.map(slot => slot["day"] === "wednesday" ?
            <ScheduleBlock
                day={slot["day"]}
                time={slot["time"]}
                location={slot["location"]}
                conflicts={conflicts[slot["day"]][slot["time"]]}
                claimers={slot["claimers"]}
                claimFunction={claimSlot}
                choreogName={choreogName}
            /> : 
            null
            )}
        </div>
        <div className="Scheduling-calendar-column">
            <div>Thursday</div>
            {timeslots.map(slot => slot["day"] === "thursday" ?
            <ScheduleBlock
                day={slot["day"]}
                time={slot["time"]}
                location={slot["location"]}
                conflicts={conflicts[slot["day"]][slot["time"]]}
                claimers={slot["claimers"]}
                claimFunction={claimSlot}
                choreogName={choreogName}
            /> : 
            null
            )}
        </div>
        <div className="Scheduling-calendar-column">
            <div>Friday</div>
            {timeslots.map(slot => slot["day"] === "friday" ?
            <ScheduleBlock
                day={slot["day"]}   
                time={slot["time"]}
                location={slot["location"]}
                conflicts={conflicts[slot["day"]][slot["time"]]}
                claimers={slot["claimers"]}
                claimFunction={claimSlot}
                choreogName={choreogName}
            /> : 
            null
            )}
        </div>
        <div className="Scheduling-calendar-column">
            <div>Saturday</div>
            {timeslots.map(slot => slot["day"] === "saturday" ?
            <ScheduleBlock
                day={slot["day"]}
                time={slot["time"]}
                location={slot["location"]}
                conflicts={conflicts[slot["day"]][slot["time"]]}
                claimers={slot["claimers"]}
                claimFunction={claimSlot}
                choreogName={choreogName}
            /> : 
            null
            )}
        </div>
    </div>
    : <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>}
        
    </div>
  );
  
}

export default Scheduling;