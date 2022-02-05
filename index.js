const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3005

// Dependencies
const { Notion } = require("@neurosity/notion");
require("dotenv").config();

// Authentication
const deviceId = "93ef187ea107d9a1b93baa6875eaf458";//"efd3f5d13fcaf2880b5f48615c6985ca";//process.env.DEVICE_ID  "";
const email = "hello@vrhuman.com";//"louiseylai@gmail.com"*/;//process.env.EMAIL  "";
const password = "NewAdventure";//"ARHouse";//process.env.PASSWORD  "";

const verifyEnvs = (email, password, deviceId) => {
    const invalidEnv = (env) => {
      return env === "" || env === 0;
    };
    if (
      invalidEnv(email) ||
      invalidEnv(password) || 
      invalidEnv(deviceId) 
    ) {
      console.error(
        "Please verify deviceId, email and password are in .env file, quitting..."
      );
      process.exit(0);
    }
  };
  verifyEnvs(email, password, deviceId);

  console.log(`${email} attempting to authenticate to ${deviceId}`);

  //var express = require('express')
  var app = express()
  var prob = 0.0;

  // Instantiating a notion
  const notion = new Notion({
    deviceId
  });

  // Async login
  const main = async () => {
    await notion
      .login({
        email,
        password
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
    console.log("Logged in");

    // ----------------------------- Subscriptions -----------------------------
    // Calm subscription
    notion.calm().subscribe((calm) => {
        prob = calm.probability;
      });

    // Focus subscription
    // notion.focus().subscribe((calm) => {
    //   prob = calm.probability;
    // });

    notion.predictions("disappear").subscribe(prediction => {
      // Switch light off/on
      //light.togglePower();
      prob = prediction.probability;
      console.log(prob)
    });

    // --------------------------------------------------------------------------

      // respond with calm score when a GET request is made to the homepage
    app.get('/', function (req, res) {
      res.json({kinesisScore: prob})

    })

      app.listen(PORT)
  };

  main();