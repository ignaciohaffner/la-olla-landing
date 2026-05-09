import { Router } from 'express';
import { listMessages, markRead, unreadCount } from '../../controllers/admin/contact.controller';

const router = Router();

router.get('/contact/unread-count', unreadCount);
router.get('/contact', listMessages);
router.patch('/contact/:id/read', markRead);

export default router;
