const mongoose = require('mongoose');

const db_url = process.env.DB_URL;

/**
 * connection
 */

 mongoose.connect( db_url, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex: true
 }, (error, connection) => {
     // check error
     if (error) {
         console.log('Error in dv connection: ', error);
     } else {
        console.log('DB connection successfull....');
     }
 });