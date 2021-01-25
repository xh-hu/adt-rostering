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
        if (user.email == req.query.gmail) res.send({});
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

router.get("/allDancers", (req, res) => {
  Dancer.find({}).then((dancers) => {
    res.send(dancers);
  });
})

router.post("/addToDance", (req, res) => {
  Dance.find({ danceId: req.body.danceId }).then((dance) => {
    if (dance.length === 0) {
      const newDance = new Dance({
        danceName: req.body.danceName,
        danceId: req.body.danceId,
        members: [req.body.dancer],
      });
      newDance.save().then(() => {
        res.send({});
      })
    }
    else {
      Dance.updateOne(
        { danceId: req.body.danceId },
        { $push: {members: req.body.dancer} }
        ).then(() => res.send({}));
    }
  })
})

router.post("/removeFromDance", (req, res) => {
  Dance.findOne({ danceId: req.body.danceId }).then((dance) => {
      const tempList = dance.members.slice();
      let ind = -1;
      for (var i = 0; i < tempList.length; i++) {
        if (tempList[i].auditionNum == req.body.dancer.auditionNum) {
          ind = i;
        }
      }
      if (ind !== -1) {
        tempList.splice(ind, 1);
        Dance.updateOne(
          { danceId: req.body.danceId },
          { $set: {members: tempList }}
          ).then(() => res.send({}));
      }
    });
})

router.get("/getDance", (req, res) => {
  console.log("what?")
  Dance.findOne({ danceId: req.query.danceId }).then((dance) => {
    console.log(dance);
    res.send(dance.members);
  })
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
