//npm packages
const Express = require("express");
const BodyParser = require("body-parser");
const Morgan = require("morgan");

//instantiation
const app = Express();
let profiles = [];
const port = 3000;
//configuration

//middleware
const apiVerification = (request, response, next) => {
   if (request.query.api && request.query.api == "1234") {
      console.log("Authorised for ", request.url, "\n");
      next();
   } else {
      response.status(401).send("Not Authorised\n");
   }
};
app.use(Morgan("dev")); //using morgan middleware for development environment
app.use(BodyParser.json()); //using body parser for json parsing

//routes
app.get("/", (req, res) => {
   res.send("HOME!");
});

app.get("/profile", apiVerification, (req, res) => {
   if (req.query.id) {
      //retrieving single user's profile distinguished by id
      res.send(profiles[req.query.id]);
   } else {
      //retrieving all users' profile from collection
      res.send(profiles);
   }
});

app.post("/profile", apiVerification, (req, res) => {
   //adding new user profile to profile collection
   const userProfile = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
   };
   if (
      userProfile.firstName &&
      userProfile.lastName &&
      userProfile.email &&
      userProfile.password
   ) {
      profiles.push(userProfile);
      res.send(`${req.body.firstName} Added`);
   } else {
      res.sendStatus(400);
   }
});

app.put("/profile/:id", apiVerification, (req, res) => {
   //updating user profile based on ID
   Object.assign(profiles[req.params.id], req.body);
   res.send(`${profiles[req.params.id].firstName} Updated`);
});

app.delete("/profile/:id", (req, res) => {
   //deleting user profile based on ID
   profiles.splice(req.params.id, 1);
   res.send("Profile deleted");
});
//error correction

//server export/server run
app.listen(port);
