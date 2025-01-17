const passport = require("passport");
const LocalStategy = require("passport-local").Strategy;
const Person = require("../models/Person");

passport.use(
  new LocalStategy(async (USERNAME, password, done) => {
    try {
      const user = await Person.findOne({ username: USERNAME });
      if (!user) {
        return done(null, false, { message: "Invalid username" });
      }
      const isPasswordValid = await user.comparePassword(password);
      // const isPasswordValid=await user.password===password?true:false; with out bcrypt
      if (isPasswordValid) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Invalid password" });
      }
    } catch (err) {
      return done(err);
    }
  })
);
module.exports = passport;
