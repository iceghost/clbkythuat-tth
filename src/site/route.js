const router = require('express').Router();

router.get('/', (req, res) => { res.render('site/home'); });
router.get('/guide', (req, res) => { res.render('site/guide'); });

module.exports = router;
