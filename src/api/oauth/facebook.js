'use strict';
import dotenv from 'dotenv';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook'; 
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
dotenv.config();

const oAuthRouter = new Router();
      oAuthRouter.use(bodyParser());

passport.use(new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID, // Use 'clientID' instead of 'clientId'
      clientSecret: process.env.FACEBOOK_SECRET, // Use 'clientSecret' instead of 'secret'
      profileFields:  ['id', 'displayName', 'name', 'last_name', 'email', 'gender', 'languages', 'picture'],
      callbackURL: '/facebook',
    },
    (accessToken, refreshToken, profile, callback) => {
      callback(null, profile);
    })
);

passport.serializeUser(async (user, callback) => {
  callback(null, user);
});

passport.deserializeUser(async (user, callback) => {
  callback(null, user);
});

oAuthRouter.get('/api/oauth/facebook', passport.authenticate('facebook', { scope: ['profile', 'email'] })); // Use 'clientID' instead of 'clientId'
oAuthRouter.get('/facebook', passport.authenticate('facebook', (res, request) => {
  console.log(request);
}));

export default [oAuthRouter, passport];
