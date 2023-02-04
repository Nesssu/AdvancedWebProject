const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const mongoDB = "mongodb://localhost:27017/testdb";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

if (process.env.NODE_ENV === "production")
{
    app.use(express.static(path.resolve("..", "client", "build")));
    app.get("*", (req, res) =>
    {
        res.sendFile(path.resolve("..", "client", "build", "index.html"))
    });
}
else if (process.env.NODE_ENV === "development")
{
    const corsOptions = {
        origin: "http:localhost:3000",
        optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));
}

module.exports = app;
