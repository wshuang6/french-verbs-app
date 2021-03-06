const path = require('path');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// Require mongoose models
const { VerbGroup } = require('./models/verbGroup');
const {User} = require('./models/users');

// Require routers
const { verbsRouter } = require('./routers/verbsRouter');

let secret = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL
}

if(process.env.NODE_ENV != 'production') {
  secret = require('./secret');
}

const app = express();

app.use(passport.initialize());

// Passport middleware set-up
passport.use(
    new GoogleStrategy({
        clientID:  secret.CLIENT_ID,
        clientSecret: secret.CLIENT_SECRET,
        callbackURL: `/api/auth/google/callback`
    },
    (accessToken, refreshToken, profile, cb) => {
        let _user = {
            googleId: profile.id,
            displayName: profile.displayName,
            accessToken
        }
        return User
            .findOne({googleId: _user.googleId})
            .exec()
            .then(user => {
                if (user) {
                    return User.findByIdAndUpdate(user._id, {$set: {accessToken}}, {new: true})
                }
                return User.create(_user)
            })
            .then(user => cb(null, _user))
            .catch(err => console.error(err))
    }
));

passport.use(
    new BearerStrategy(
        (token, done) => {
            return User.findOne({accessToken: token})
                .exec()
                .then((user) => {
                    if (!user) {
                        return done(null, false);
                    }
                    return done(null, {
                        googleId: user.googleId, 
                        displayName: user.displayName, 
                        accessToken: user.accessToken
                    });
                })
                .catch(err => console.error(err))
        }
    )
);
// Authentication endpoints
app.get('/api/auth/google',
    passport.authenticate('google', {scope: ['profile']}));

app.get('/api/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
        session: false
    }),
    (req, res) => {
        res.cookie('accessToken', req.user.accessToken, {expires: 0});
        res.redirect('/');
    }
);

app.get('/api/auth/logout', (req, res) => {
    req.logout();
    res.clearCookie('accessToken');
    res.redirect('/');
});

app.get('/api/me',
    passport.authenticate('bearer', {session: false}),
    (req, res) => {
        return res.json({
        googleId: req.user.googleId,
        displayName: req.user.displayName
    })}
);

// API endpoints

app.use('/api/verbs', passport.authenticate('bearer', {session: false}),  verbsRouter);

// Serve the built client
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Unhandled requests which aren't for the API should serve index.html so
// client-side routing using browserHistory can function
app.get(/^(?!\/api(\/|$))/, (req, res) => {
    const index = path.resolve(__dirname, '../client/build', 'index.html');
    res.sendFile(index);
});

let server;
function runServer(port=3001) {
	return new Promise((resolve, reject) => {
		mongoose.connect(secret.DATABASE_URL, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				resolve();
			})
			.on('error', err => {
				reject(err);
			});
		});	
	});
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer();
}

module.exports = {
    app, runServer, closeServer
};
