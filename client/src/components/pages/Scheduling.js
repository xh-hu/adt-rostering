import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";
import ScheduleBlock from "../modules/ScheduleBlock";

import "./Scheduling.css";
import { socket } from "../../client-socket.js";


function Scheduling(props) {
  const { choreogName, danceName, timeslots, conflicts, makingChanges} = props;

  const [allTimeslots, setAllTimeslots] = useState(null);

  useEffect(() => {
    if (!allTimeslots && timeslots) {
        setAllTimeslots(timeslots);
    }
  }, [timeslots])

  useEffect(() => {
    socket.once("claimSlot", (data) => {
        console.log(data.name + " claimed " + data.slot.day + ", " + data.slot.time + ", " + data.slot.location);
        const updatedClaimers = data.slot.claimers;
        const updatedTimeslots = allTimeslots.slice();
        for (let i = 0; i < allTimeslots.length; i++) {
            if (updatedTimeslots[i]["day"] == data.slot.day && updatedTimeslots[i]["time"] == data.slot.time && updatedTimeslots[i]["location"] == data.slot.location) {
                updatedTimeslots[i]["claimers"] = updatedClaimers;
            }
        }
        setAllTimeslots(updatedTimeslots);
    })
    return () => {
        socket.off("claimSlot");
    }
  })

  useEffect(() => {
    socket.once("unclaimSlot", (data) => {
        console.log(data.name + " unclaimed " + data.slot.day + ", " + data.slot.time + ", " + data.slot.location);
        const updatedClaimers = data.slot.claimers;
        const updatedTimeslots = allTimeslots.slice();
        for (let i = 0; i < allTimeslots.length; i++) {
            if (updatedTimeslots[i]["day"] == data.slot.day && updatedTimeslots[i]["time"] == data.slot.time && updatedTimeslots[i]["location"] == data.slot.location) {
                updatedTimeslots[i]["claimers"] = updatedClaimers;
            }
        }
        setAllTimeslots(updatedTimeslots);
    })
    return () => {
        socket.off("unclaimSlot");
    }
  })

  function claimSlot(dayString, timeString, locationString, claimers) {
    const claimString = choreogName + " (" + danceName + ")"
      if (!claimers.includes(claimString)) {
        post("/api/claimSlot", {choreogName: claimString, day: dayString, time: timeString, location: locationString}).then((res) => {
            console.log("claimed");
        })
      }
      else {
        post("/api/unclaimSlot", {choreogName: claimString, day: dayString, time: timeString, location: locationString}).then((res) => {
            console.log("UNclaimed");
        })
      }
  }

  return (
    <div className="Scheduling-container">
        {makingChanges ? 
        <div className="Dance-blockingChanges">
          Calculating... please be patient!
        </div> : 
        null}
       <div className="Scheduling-title">
           Time and Room Selection
        </div> 
        <div className="Scheduling-description">Claim room/times for your dance.
      Green claim button means no conflicts, and orange button means at least one dancer in your rostered list has a conflict.
      <br></br>
      <br></br>
      Mouse over the orange claim button to see the dancers which have conflicts.
      </div>
        {allTimeslots && conflicts ? 
        <div className="Scheduling-calendar-section">
        <div className="Scheduling-calendar-column">
            <div>Sunday</div>
            {allTimeslots.map(slot => slot["day"] === "sunday" ?
            <ScheduleBlock
                day={slot["day"]}
                time={slot["time"]}
                location={slot["location"]}
                conflicts={conflicts[slot["day"]][slot["time"]]}
                claimers={slot["claimers"]}
                claimFunction={claimSlot}
                choreogName={choreogName + " (" + danceName + ")"}
            /> : 
            null
            )}
        </div>
        <div className="Scheduling-calendar-column">
            <div>Monday</div>
            {allTimeslots.map(slot => slot["day"] === "monday" ?
            <ScheduleBlock
                day={slot["day"]}
                time={slot["time"]}
                location={slot["location"]}
                conflicts={conflicts[slot["day"]][slot["time"]]}
                claimers={slot["claimers"]}
                claimFunction={claimSlot}
                choreogName={choreogName + " (" + danceName + ")"}
            /> : 
            null
            )}
        </div>
        <div className="Scheduling-calendar-column">
            <div>Tuesday</div>
            {allTimeslots.map(slot => slot["day"] === "tuesday" ?
            <ScheduleBlock
                day={slot["day"]}
                time={slot["time"]}
                location={slot["location"]}
                conflicts={conflicts[slot["day"]][slot["time"]]}
                claimers={slot["claimers"]}
                claimFunction={claimSlot}
                choreogName={choreogName + " (" + danceName + ")"}
            /> : 
            null
            )}
        </div>
        <div className="Scheduling-calendar-column">
            <div>Wednesday</div>
            {allTimeslots.map(slot => slot["day"] === "wednesday" ?
            <ScheduleBlock
                day={slot["day"]}
                time={slot["time"]}
                location={slot["location"]}
                conflicts={conflicts[slot["day"]][slot["time"]]}
                claimers={slot["claimers"]}
                claimFunction={claimSlot}
                choreogName={choreogName + " (" + danceName + ")"}
            /> : 
            null
            )}
        </div>
        <div className="Scheduling-calendar-column">
            <div>Thursday</div>
            {allTimeslots.map(slot => slot["day"] === "thursday" ?
            <ScheduleBlock
                day={slot["day"]}
                time={slot["time"]}
                location={slot["location"]}
                conflicts={conflicts[slot["day"]][slot["time"]]}
                claimers={slot["claimers"]}
                claimFunction={claimSlot}
                choreogName={choreogName + " (" + danceName + ")"}
            /> : 
            null
            )}
        </div>
        <div className="Scheduling-calendar-column">
            <div>Friday</div>
            {allTimeslots.map(slot => slot["day"] === "friday" ?
            <ScheduleBlock
                day={slot["day"]}   
                time={slot["time"]}
                location={slot["location"]}
                conflicts={conflicts[slot["day"]][slot["time"]]}
                claimers={slot["claimers"]}
                claimFunction={claimSlot}
                choreogName={choreogName + " (" + danceName + ")"}
            /> : 
            null
            )}
        </div>
        <div className="Scheduling-calendar-column">
            <div>Saturday</div>
            {allTimeslots.map(slot => slot["day"] === "saturday" ?
            <ScheduleBlock
                day={slot["day"]}
                time={slot["time"]}
                location={slot["location"]}
                conflicts={conflicts[slot["day"]][slot["time"]]}
                claimers={slot["claimers"]}
                claimFunction={claimSlot}
                choreogName={choreogName + " (" + danceName + ")"}
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