const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function configurePassport(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, callback) => {
        const userData = profile._json;
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: userData.email },
          });
          if (existingUser) {
            return callback(null, profile);
          }
          const newUser = await prisma.user.create({
            data: {
              googleId: userData.sub,
              email: userData.email,
              photo: userData.picture,
            },
          });
          callback(null, newUser);
        } catch (err) {
          callback(err, null);
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
}

module.exports = configurePassport;
