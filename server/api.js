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
const dancer = require("./models/dancer");


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

router.get("/allDancers", auth.ensureLoggedIn, (req, res) => {
  Dancer.find({}).then((dancers) => {
    res.send(dancers);
  });
})

router.post("/addToDance", auth.ensureLoggedIn, (req, res) => {
  Dancer.findOne({auditionNum: req.body.dancer.auditionNum}).then((dancer) => {
    if (dancer.rosteredDances) {
      console.log("dance does not exist, dancer rosteredDances exists");
      Dancer.updateOne(
        { auditionNum: req.body.dancer.auditionNum},
        { $push: {rosteredDances: req.body.danceName}}
      ).then(() => {
        Dance.find({ danceId: req.body.danceId }).then((dance) => {
          Dancer.findOne({auditionNum: req.body.dancer.auditionNum}).then((updatedDancer) => {
            if (dance.length === 0) {
              const newDance = new Dance({
                danceName: req.body.danceName,
                danceId: req.body.danceId,
                members: [updatedDancer],
              });
              newDance.save().then(() => res.send({}));
            }
            else {
              Dance.updateOne(
                { danceId: req.body.danceId },
                { $push: {members: updatedDancer} }
                ).then(() => res.send({}));
            }
          })
        })

      });
    }
    else {
      console.log("nothing exists");
      Dancer.updateOne(
        { auditionNum: req.body.dancer.auditionNum},
        { $set: {rosteredDances: [req.body.danceName]}}
      ).then(() => res.send({}));
    }
  });
  
})

router.post("/removeFromDance", auth.ensureLoggedIn, (req, res) => {
  Dancer.findOne({auditionNum: req.body.dancer.auditionNum}).then((dancer) => {
    let ind = -1;
    for (var i = 0; i < dancer.rosteredDances.length; i++) {
      if (dancer.rosteredDances[i] === req.body.danceName) {
        ind = i;
        console.log(ind);
        break;
      }
    }
    const tempList = dancer.rosteredDances.slice();
    tempList.splice(ind, 1);
    Dancer.updateOne(
      { auditionNum: req.body.dancer.auditionNum},
      { $set: {rosteredDances: tempList}}
    ).then(() => {
      Dance.findOne({ danceId: req.body.danceId }).then((dance) => {
        const tempMembers = dance.members.slice();
        let ind = -1;
        for (var i = 0; i < tempMembers.length; i++) {
          if (tempMembers[i].auditionNum == req.body.dancer.auditionNum) {
            ind = i;
          }
        }
        if (ind !== -1) {
          tempMembers.splice(ind, 1);
          Dance.updateOne(
            { danceId: req.body.danceId },
            { $set: {members: tempMembers }}
            ).then(() => {
              res.send({});
            });
        }
      });
    });
  });
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

router.get("/getDancer", auth.ensureLoggedIn, (req, res) => {
  dancer.findOne({ auditionNum: req.query.dancerAuditionNum }).then((dancer) => {
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
