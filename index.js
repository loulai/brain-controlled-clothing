// Dependencies
const { Notion } = require("@neurosity/notion");
require("dotenv").config();

// Authentication
const deviceId = process.env.DEVICE_ID || "";
const email = process.env.EMAIL || "";
const password = process.env.PASSWORD || "";

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

  var express = require('express')
  var app = express()
  var prob = 0.0;

  // respond with calm score when a GET request is made to the homepage
  app.get('/', function (req, res) {
    res.json({calmScore: prob})

  })

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

    // Calm subscription
    notion.calm().subscribe((calm) => {
        prob = calm.probability;
      });
    

    // Kinesis
    const mind = new Notion();

    mind.kinesis("disappear").subscribe(intent => {
      // Switch light off/on
      //light.togglePower();
      prob = intent.probability;
    });

      app.listen(3000)
  };

  main();
