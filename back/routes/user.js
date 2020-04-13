const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');

const { isLoggedIn, isNotLoggedIn } = require('./middleware');
const router = express.Router();

router.get('/', isLoggedIn, (req, res) => { //GET 내 정보 가져오기
    const user = Object.assign({}, req.user.toJSON());
    delete user.password;
    return res.json(user);
});

router.post('/', isNotLoggedIn, async (req, res, next) => { //POST /api/user 회원가입
    try {
        const exUser = await db.User.findOne({
            where: {
                userId: req.body.userId,
            },
        });
        if(exUser){
            return res.status(403).send('! 이미 사용중인 아이디입니다.');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = await db.User.create({
            nickname: req.body.nickname,
            userId: req.body.userId,
            password: hashedPassword,
        });
        return res.status(200).json(newUser);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

router.post('/logout', (req, res) => { //POST 로그아웃
    req.logout();
    req.session.destroy();
    res.send('logout 성공');
});

router.post('/login', (req, res, next) => { //POST 로그인
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            console.error(err);
            return next(err);
        }
        if(info){
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (loginErr) => {
            try {
                if(loginErr) {
                    return next(loginErr);
                }

                const fullUser = await db.User.findOne({
                    where: { id: user.id },
                    include: [{
                        model: db.Post,
                        as: 'Posts',
                        attributes: ['id'],
                    }],
                    attributes: ['id', 'nickname', 'userId'],
                });
                console.log(fullUser);
                return res.json(fullUser);
            } catch(e) {
                next(e);
            }
            
        })
    })(req, res, next);
});

module.exports = router;