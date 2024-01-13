require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8080;
const connectDb = require("./db/conn");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./model/userSchema");

connectDb();

const clientid = process.env.CLIENT_ID;
const clientsecret = process.env.CLIENT_SECRET;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    Credential: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: "qwe123asd456zxc789",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: clientid,
      clientSecret: clientsecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("GOOGLE PROFILE:", profile);
      try {
        if (
          profile.emails &&
          profile.emails.length > 0 &&
          profile.emails[0].value.endsWith("@gmail.com")
        ) {
          let user = await userdb.findOne({ googleId: profile.id });

          if (!user) {
            user = new userdb({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
              image: profile.photos[0].value,
            });

            await user.save();
          }
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid email domain" });
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  res.status(200).json("server start");
});

// initial google oauth login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "http://localhost:3000/login",
  })
);

app.get("/login/success", async (req, res) => {
  console.log("reqqqqq", req.user);
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT} `);
});
