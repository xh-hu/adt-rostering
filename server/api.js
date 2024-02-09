
const express = require("express");

const Dancer = require("./models/dancer");
const Choreog = require("./models/choreog");
const User = require("./models/user");
const Dance = require("./models/dance");
const Schedule = require("./models/schedule");

const auth = require("./auth");

const router = express.Router();

const socketManager = require("./server-socket");


router.post("/login", auth.login);


router.get('/validChoreog', (req, res) => {
  Choreog.find({ gmail: req.query.gmail}).then((choreog) => {
    User.findOne({ googleid: req.query.googleid }).then((user) => {
      if (choreog.length !== 0 && user) {
        if (user.email == req.query.gmail) res.send(choreog[0]);
      }
      else {
        res.status(401).send({ msg: "Unauthorized, not a choreographer :(" });
      }
    });
  });
});

router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  res.send({});
});

router.get("/allDancers", auth.ensureLoggedIn, (req, res) => {
  Dancer.find({}).then((dancers) => {
    res.send(dancers);
  });
})

router.post("/addToDance", auth.ensureLoggedIn, async (req, res) => {
  //Dancer logic
  const dancer = await Dancer.findOne({_id: req.body.dancer._id});
  if (dancer.rosteredDances) {
    if (!dancer.rosteredDances.includes(req.body.danceName)) {
      const updatedDancer = await Dancer.findOneAndUpdate(
        { _id: req.body.dancer._id},
        { $push: {rosteredDances: req.body.danceName}},
        { new: true}
      );
      // console.log("updated Dancer: " + updatedDancer);
      const dance = await Dance.find({ danceId: req.body.danceId, style: req.body.style })
      if (dance.length === 0) {
        const newDance = new Dance({
          danceName: req.body.danceName,
          danceId: req.body.danceId,
          members: [updatedDancer],
          style: req.body.style,
        });
        await newDance.save();
      }
      else {
        await Dance.updateOne(
          { danceId: req.body.danceId },
          { $push: {members: updatedDancer} }
        );
      }
      await updateOtherDancesForAdd(dancer, updatedDancer);
      await socketManager.getIo().emit("addDancerToDance", {name: req.body.choreogName, addedDancer: dancer, danceName: req.body.danceName});
      res.send(updatedDancer);
    }
    else {
      res.send({errMsg: "Already in dance."});
    }
  }
  else {
    const updatedDancer = await Dancer.findOneAndUpdate(
      { _id: req.body.dancer._id},
      { $set: {rosteredDances: [req.body.danceName]}},
      { new: true}
    )
    const dance = await Dance.find({ danceId: req.body.danceId, style: req.body.style});
    if (dance.length === 0) {
      const newDance = new Dance({
        danceName: req.body.danceName,
        danceId: req.body.danceId,
        members: [updatedDancer],
        style: req.body.style,
      });
      await newDance.save();
    }
    else {
      await Dance.updateOne(
        { danceId: req.body.danceId },
        { $push: {members: updatedDancer} }
      );
    }
    await updateOtherDancesForAdd(dancer, updatedDancer);
    await socketManager.getIo().emit("addDancerToDance", {name: req.body.choreogName, addedDancer: dancer, danceName: req.body.danceName});
    res.send(updatedDancer);
  }
})

async function updateOtherDancesForAdd(oldDancer, updatedDancer) {
  const otherDances = await Dance.find({"members._id": oldDancer._id});
  console.log("found to add: " + otherDances.length);
  for (let i = 0; i < otherDances.length; i++) {
    let ind = -1;
    for (let j = 0; j < otherDances[i].members.length; j++) {
      if (otherDances[i].members[j]._id.toString() == oldDancer._id.toString()) {
        ind = j;
        break;
      }
    }
    if (ind !== -1) {
      let tempList = [...otherDances[i].members.slice(0, ind), updatedDancer, ...otherDances[i].members.slice(ind+1)];
      await Dance.findOneAndUpdate(
        { _id: otherDances[i]._id },
        { $set: {members: tempList}}
      ); 
    }
  }
}

router.post("/removeFromDance", auth.ensureLoggedIn, async (req, res) => {
  const dancer = await Dancer.findOne({_id: req.body.dancer._id});
  let ind = -1;
  if (dancer == null) {
    res.status(404).send({ msg: "Dancer not found" });
    return;
  }
  for (let i = 0; i < dancer.rosteredDances.length; i++) {
    if (dancer.rosteredDances[i].toString() === req.body.danceName.toString()) {
      ind = i;
      break;
    }
  }
  if (ind !== -1) {
    const tempList = [...dancer.rosteredDances.slice(0, ind), ...dancer.rosteredDances.slice(ind+1)];
    const updatedDancer = await Dancer.findOneAndUpdate(
      { _id: req.body.dancer._id},
      { $set: { rosteredDances: tempList }},
      { new: true}
    );
    // console.log("updated dancer: " + updatedDancer);
    let dance = await Dance.findOne({ danceId: req.body.danceId });
    let ind2 = -1;
    for (let i = 0; i < dance.members.length; i++) {
      if (dance.members[i]._id.toString() == req.body.dancer._id.toString()) {
        ind2 = i;
        break;
      }
    }
    if (ind2 !== -1) {
      const tempMembers = [...dance.members.slice(0, ind2), ...dance.members.slice(ind2+1)]
      await Dance.updateOne(
        { danceId: req.body.danceId },
        { $set: {members: tempMembers }}
      );
      await updateOtherDancesForRemove(dancer, updatedDancer);
      await socketManager.getIo().emit("removeDancerFromDance", {name: req.body.choreogName, removedDancer: dancer, danceName: req.body.danceName});
      res.send(updatedDancer);
    }
    else {
      res.send({errMsg: "Already removed."});
    }
  }
  else {
    res.send({errMsg: "Already removed."});
  }
})

async function updateOtherDancesForRemove(oldDancer, updatedDancer) {
  const otherDances = await Dance.find({"members._id": oldDancer._id});
  console.log("found to remove: " + otherDances.length);
  for (let i = 0; i < otherDances.length; i++) {
    let ind = -1;
    for (let j = 0; j < otherDances[i].members.length; j++) {
      if (otherDances[i].members[j]._id.toString() == oldDancer._id.toString()) {
        ind = j;
        break;
      }
    }
    if (ind !== -1) {
      let tempList = [...otherDances[i].members.slice(0, ind), updatedDancer, ...otherDances[i].members.slice(ind+1)];
      await Dance.findOneAndUpdate(
        { _id: otherDances[i]._id },
        { $set: {members: tempList}},
        { new: true}
      );
    }
    
  }
}

router.post("/notTaking", auth.ensureLoggedIn, async (req, res) => {
  //Dancer logic
  const dancer = await Dancer.findOne({_id: req.body.dancer._id});
  console.log("notTaking")
  console.log(dancer.firstName)
  if (dancer.rejectedDances) {
    if (!dancer.rejectedDances.includes(req.body.danceName)) {
      const updatedDancer = await Dancer.findOneAndUpdate(
        { _id: req.body.dancer._id},
        { $push: {rejectedDances: req.body.danceName}},
        { new: true}
      );
      console.log("updated Dancer: " + updatedDancer);
      await socketManager.getIo().emit("notTakingDancerForDance", {name: req.body.choreogName, rejDancer: dancer, danceName: req.body.danceName});
      res.send(updatedDancer);
    }
    else {
      res.send({errMsg: "Already was rejected"});
    }
  }
  else {
    const updatedDancer = await Dancer.findOneAndUpdate(
      { _id: req.body.dancer._id},
      { $set: {rejectedDances: [req.body.danceName]}},
      { new: true}
    )
    await socketManager.getIo().emit("notTakingDancerForDance", {name: req.body.choreogName, rejDancer: updatedDancer, danceName: req.body.danceName});
    res.send(updatedDancer);
  }
})

router.post("/mightTake", auth.ensureLoggedIn, async (req, res) => {
  const dancer = await Dancer.findOne({_id: req.body.dancer._id});
  console.log("mightTake")
  console.log(dancer.firstName)
  let ind = -1;
  if (dancer == null) {
    res.status(404).send({ msg: "Dancer not found" });
    return;
  }
  for (let i = 0; i < dancer.rejectedDances.length; i++) {
    if (dancer.rejectedDances[i].toString() === req.body.danceName.toString()) {
      ind = i;
      break;
    }
  }
  if (ind !== -1) {
    const tempList = [...dancer.rejectedDances.slice(0, ind), ...dancer.rejectedDances.slice(ind+1)];
    const updatedDancer = await Dancer.findOneAndUpdate(
      { _id: req.body.dancer._id},
      { $set: { rejectedDances: tempList }},
      { new: true}
    );
    console.log("updated dancer: " + updatedDancer);
    await socketManager.getIo().emit("considerDancerForDance", {name: req.body.choreogName, accDancer: updatedDancer, danceName: req.body.danceName});
    res.send(updatedDancer);
  }
  else {
    res.send({errMsg: "Already might take."});
  }
})

router.get("/getDance", auth.ensureLoggedIn, (req, res) => {
  Dance.findOne({ danceId: req.query.danceId }).then((dance) => {
    if (dance) {
      res.send(dance.members);
    }
    else {
      res.send([]);
    }
    
  });
})

router.get("/getAllDances", auth.ensureLoggedIn, async (req, res) => {
  const allDances = {};
  const allChoreogs = await Choreog.find({})
  const dances = await Dance.find({});
  const danceIndToMembersMap = {};
  for (let i = 0; i < dances.length; i++) {
    danceIndToMembersMap[dances[i].danceId] = dances[i].members;
  }
  for (let i = 0; i < allChoreogs.length; i++) {
    const currDanceName = allChoreogs[i].dance_name;
    const currDanceIndex = allChoreogs[i].dance_index;
    if (danceIndToMembersMap[currDanceIndex]) {
      allDances[currDanceName] = danceIndToMembersMap[currDanceIndex];
    }
    else {
      allDances[currDanceName] = [];
    }
  }
  res.send(allDances);
})

router.get("/getDanceIndexToName", auth.ensureLoggedIn, async (req, res) => {
  const danceIndexToName = {};
  const allChoreogs = await Choreog.find({})
  for (let i = 0; i < allChoreogs.length; i++) {
    danceIndexToName[allChoreogs[i].dance_index] = allChoreogs[i].dance_name;
  }
  res.send(danceIndexToName);
})

router.get("/getDancer", auth.ensureLoggedIn, (req, res) => {
  Dancer.findOne({ _id: req.query.dancerId }).then((dancer) => {
    if (dancer) {
      res.send(dancer);
    }
    else {
      res.send(null);
    }
    
  });
})

router.get("/allChoreogs", auth.ensureLoggedIn, (req, res) => {
  Choreog.find({}).then((data) => {
    res.send(data);
  })
})

router.get("/hiphopCount", auth.ensureLoggedIn, async (req, res) => {
  const dancer = await Dancer.findOne({ _id: req.query.dancerId});
  let count = 0;
  if (dancer != null && dancer.rosteredDances) {
    for (let dance of dancer.rosteredDances) {
      const currDance = await Dance.findOne({danceName: dance});
      if (currDance != null && currDance.style === "hiphop"){
        count = count + 1;
      }
    }
  }
  res.send({hiphopCount: count});
})

router.get("/timeslots", auth.ensureLoggedIn, async (req, res) => {
  Schedule.find({}).then((data) => {
    res.send(data);
  })
})

router.post("/claimSlot", auth.ensureLoggedIn, async (req, res) => {
  const slot = await Schedule.findOne({day: req.body.day, time: req.body.time, location: req.body.location});
  if (slot.claimers == null) {
    await Schedule.updateOne(
      { day: req.body.day , time: req.body.time, location: req.body.location},
      { $set: {claimers: [req.body.choreogName] }}
    );
  }
  else {
    await Schedule.updateOne(
      { day: req.body.day , time: req.body.time, location: req.body.location},
      { $push: {claimers: req.body.choreogName }}
    )
  }
  const updatedSlot = await Schedule.findOne({day: req.body.day, time: req.body.time, location: req.body.location});
  await socketManager.getIo().emit("claimSlot", {name: req.body.choreogName, slot: updatedSlot});
  res.send(slot);
})

router.post("/unclaimSlot", auth.ensureLoggedIn, async (req, res) => {
  const slot = await Schedule.findOne({day: req.body.day, time: req.body.time, location: req.body.location});
  if (slot.claimers != null && slot.claimers.includes(req.body.choreogName)) {
    let ind = -1;
    for (let i = 0; i < slot.claimers.length; i++) {
      if (slot.claimers[i].toString() === req.body.choreogName.toString()) {
        ind = i;
        break;
      }
    }
    if (ind !== -1) {
      const tempList = [...slot.claimers.slice(0, ind), ...slot.claimers.slice(ind+1)];
      await Schedule.updateOne(
        { day: req.body.day , time: req.body.time, location: req.body.location},
        { $set: {claimers: tempList }}
      );
    }
  }
  const updatedSlot = await Schedule.findOne({day: req.body.day, time: req.body.time, location: req.body.location});
  await socketManager.getIo().emit("unclaimSlot", {name: req.body.choreogName, slot: updatedSlot});
  res.send(slot);
})

router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
