/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const Dancer = require("./models/dancer");
const Choreog = require("./models/choreog");
const User = require("./models/user");
const Dance = require("./models/dance");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
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
      console.log("updated Dancer: " + updatedDancer);
      const dance = await Dance.find({ danceId: req.body.danceId })
      if (dance.length === 0) {
        const newDance = new Dance({
          danceName: req.body.danceName,
          danceId: req.body.danceId,
          members: [updatedDancer],
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
      res.send("Already in dance.");
    }
  }
  else {
    const updatedDancer = await Dancer.findOneAndUpdate(
      { _id: req.body.dancer._id},
      { $set: {rosteredDances: [req.body.danceName]}},
      { new: true}
    )
    const dance = await Dance.find({ danceId: req.body.danceId });
    if (dance.length === 0) {
      const newDance = new Dance({
        danceName: req.body.danceName,
        danceId: req.body.danceId,
        members: [updatedDancer],
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
  const otherDances = await Dance.find({members: oldDancer});
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
  for (let i = 0; i < dancer.rosteredDances.length; i++) {
    if (dancer.rosteredDances[i] === req.body.danceName) {
      ind = i;
      break;
    }
  }
  const tempList = [...dancer.rosteredDances.slice(0, ind), ...dancer.rosteredDances.slice(ind+1)];
  const updatedDancer = await Dancer.findOneAndUpdate(
    { _id: req.body.dancer._id},
    { $set: {rosteredDances: tempList}},
    { new: true}
  );
  console.log("updated dancer: " + updatedDancer);
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
    await updateOtherDancesForRemove(dancer);
    await socketManager.getIo().emit("removeDancerFromDance", {name: req.body.choreogName, removedDancer: dancer, danceName: req.body.danceName});
    res.send(updatedDancer);
  }
  else {
    res.send("Already removed");
  }
})

async function updateOtherDancesForRemove(oldDancer) {
  const otherDances = await Dance.find({members: oldDancer});
  for (let i = 0; i < otherDances.length; i++) {
    let ind = -1;
    for (let j = 0; j < otherDances[i].members.length; j++) {
      if (otherDances[i].members[j]._id.toString() == oldDancer._id.toString()) {
        ind = j;
        break;
      }
    }
    if (ind !== -1) {
      let tempList = [...otherDances[i].members.slice(0, ind), ...otherDances[i].members.slice(ind+1)];
      await Dance.findOneAndUpdate(
        { _id: otherDances[i]._id },
        { $set: {members: tempList}},
        { new: true}
      );
    }
    
  }
}

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

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
