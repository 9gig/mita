const express       = require('express');
const mongoose      = require('mongoose');
const dbconfig      = require('./config/db.config');
const unless        = require('express-unless');
const cors          = require('cors');
const dotenv        = require('dotenv');
const config        = require('./config/twili');

const path = require('path');
const client       = require("twilio")(config.account_sid, config.auth_token)


const app = express();
dotenv.config();

// GETTING AUTH & ERRORS MIDDLEWARES
const auth          = require('./middlewares/😁');
const errors        = require('./middlewares/😡');
const bodyParser = require('body-parser');


// INITIALIZING EXPRESS

app.use(cors({origin:"*"}));

// MONGODB CONNECTION
mongoose.Promise = global.Promise;
mongoose.connect(dbconfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  }).then(() => {
    console.log("Your db has been connected successfuly...Lets roll😊");
  },
    (error) => {
        console.log('An Error occured: '+ error );
    } 
  );

   // INIT bodyParser
  //  app.use(bodyParser.urlencoded({extended: true}));
   // CHECKING TOKEN IF NEEDED
  
   
 
  

// app.get("/", function (req, res) {
 
// client.verify.services(config.service_id)
// .verifications
// .create({to: '+2348087656557', channel: 'sms'})
// .then(verification => console.log(verification));
// });
// METHOD TO USE REQUEST AS AN OBJECT



//Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


// // app.engine('hbs', hbs({extname: 'hbs'}));
// app.set('view engine', hbs);
// app.use(express.static(__dirname + '/public/'));

// ROUTES

app.use("http://mita-mvp.herokuapp.com/uploads", express.static("uploads"));

app.use("/admin", require("./routes/admin.routes"));



 // TOKEN BYPASS PAGES
 express.static.unless = unless;
auth.authenticateToken.unless = unless;
  app.use(
      auth.authenticateToken.unless({
          path:[
              // 'http://mita-mvp.herokuapp.com/uploads/',
              {url:"/users/login", method: ["POST"]},
              {url:"/users/register", method: ["POST"]},
              {url:"/users/otpRequest", method: ["POST"]},
              {url:"/users/checkCode", method: ["POST"]},
      
              {url:"/admin/", method: ["GET"]},
              {url:"/admin/requests", method: ["GET"]},
          ]
      })
  );
  app.use("/users", require("./routes/users.routes"));
  
app.use(errors.errorHandler);
    
   
app.listen(process.env.PORT || 5000);
