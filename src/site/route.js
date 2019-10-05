import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => { res.render('site/home'); });
router.get('/guide', (req, res) => { res.render('site/guide'); });

export default router;
