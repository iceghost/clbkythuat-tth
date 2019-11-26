import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => { res.render('site/home'); });
router.get('/guide', (req, res) => { res.render('site/guide'); });
router.get('/rc-car', (req, res) => { res.render('site/rc-car'); });

export default router;