const express = require('express');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');

const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';

const app = next({ dev });
const handle = app.getRequestHandler();
dotenv.config();

app.prepare().then(() => {
    const server = express();

    server.use(morgan('dev'));
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use(cookieParser(process.env.COOKIE_SECRET));
    server.use(expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
          httpOnly: true,
          secure: false,
        },
    }));

    server.get('/mypage/:id', (req, res) => {
        return app.render(req, res, '/mypage', { id: req.params.id });
    });

    server.get('/detail/:isbn', (req, res) => {
        return app.render(req, res, '/detail', { isbn: req.params.isbn });
    });

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(prod ? process.env.PORT : 3066, () => {
        console.log(`next+express running on port ${process.env.PORT}`);
    });

});
