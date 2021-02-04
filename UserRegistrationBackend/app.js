require('dotenv').config();
const express = require('express');
const cors = require('cors');

// This will help connect the mongodb database.
const databaseConnection = require('./src/config/database');
const userRouter = require('./src/routers/user.router');

const app = express();


// Configuring cors obejct
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};

/**
 * Middleware Setup
 */
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOptions));

/**
 * Routes Setup
 */
app.use('/api/user', userRouter);

/**
 * Server Creation
 */
app.listen(process.env.APP_PORT, () => {
    console.log("Server up and running on PORT : ", process.env.APP_PORT);
})