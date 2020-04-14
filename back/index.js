const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const hpp = require('hpp');

const passportConfig = require('./passport');
const db = require('./models');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');

const prod = process.env.NODE_ENV === 'production';
dotenv.config();
const app = express();
db.sequelize.sync();
passportConfig();

if(prod) {
    app.use(hpp());
    app.use(morgan('combined'));
    app.use(cors({
        origin: 'http://bookspacereact.tk',
        credentials: true,
    }))
}else{
    app.use(morgan('dev'));
    app.use(cors({
        origin: true,
        credentials: true,
    }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
        domain: prod && '.bookspacereact.tk',
    },
    name: 'fesfx',
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('book space 백엔드 정상 동작!')
});


app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);

app.listen(prod ? process.env.PORT : 3065, () => {
    console.log(`server is running on ${process.env.PORT}`);
});