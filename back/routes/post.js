const express = require('express');
const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

router.post('/wish', async (req, res, next) => { //POST wish
    try {
        const addWish = await db.Wish.findOrCreate({
            where: {
                UserId: req.user.id,
                isbn: req.body.isbn
            },
            defaults: {
                content: req.body.content,
                title: req.body.title,
                author: req.body.author,
                isbn : req.body.isbn,
                src : req.body.src,
                UserId: req.user.id,
            }
        });
        res.json(addWish);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

router.delete('/:id', isLoggedIn, async (req, res, next) => {
    try {
        const wish = await db.Wish.findOne({ where: { id: req.params.id } });
        if (!wish){
            return res.status(404).send('위시가 존재하지 않습니다.');
        }
        await db.Wish.destroy({ where: { id: req.params.id } });
        res.send(req.params.id);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

router.get('/mypage/:id', async (req, res, next) => {
    try {
        const wishs = await db.Wish.findAll({
            where: {
                UserId: parseInt(req.params.id, 10),
            },
            order: [['createdAt', 'DESC']],
        });
        res.json(wishs);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

router.get('/detail/:id/:isbn', async (req, res, next) => {
    try {
        const wishs = await db.Wish.findAll({
            where: {
                UserId: req.params.id,
                isbn: req.params.isbn,
            },
        });
        res.json(wishs);
    } catch(e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;