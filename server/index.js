const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const express = require('express');
const mongoose = require('mongoose');
const {logger} = require("../server/src/utils");
const dbManager = require('../server/config/db/dbConnect.js');
const { notFound, errorHandler } = require('./middlewares/errorHandler.js'); 
const app = express();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;


app.use(express.json());app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.use(notFound); 
app.use(errorHandler);

const startServer = async () => {
    try {
        await dbManager.connect(); 
        logger.info('Database connected successfully');
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error(`Server failed to start: ${error.message}`);
        console.error(`Server failed to start: ${error.message}`);
    }
};

startServer();

process.on('SIGINT', async () => {
    await dbManager.close();
    process.exit(0);
});