import { Router } from 'express';

import verifyWebhook from './verify-webhook';
import replyMessage from './reply-message';

const router = Router();

router.get('/', verifyWebhook);
router.post('/', replyMessage);

export default router;
