const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5008

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
  //  .get('/', (req, res) => res.render('pages/index'))


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

  var app = express()
  var prob = 0.5;
  var calmProb;
  var focusProb;

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

    // Calm Subscription
    notion.calm().subscribe((calm) => {
        calmProb = calm.probability;
      });

    // Focus Subscription
    notion.focus().subscribe(focus => {
      focusProb = focus.probability;
    });


    // Kinesis Subcription
    //const mind = new Notion();
    // notion.kinesis("disappear").subscribe(intent => {
    //   // Switch light off/on
    //   //light.togglePower();
    //   prob = intent.probability;
    //   //console.log(intent)
    //   //console.log(intent.predictions[0].probability)
    // });
 
    console.log(`calmProb: ${calmProb}, focusProb: ${focusProb}`); // for some reason, this is always undefined, even when it works

  // --------------------------------------------------------------------------

  // GET Request
  // respond with calm and focus score when a GET request is made to the homepage
  app.get('/', function (req, res) {
    //res.send(`{calmProb: ${calmProb}},{focusProb: ${focusProb}}`); 
    res.send(`${calmProb},${focusProb}`);
  })
      app.listen(PORT);
  };

  main();
