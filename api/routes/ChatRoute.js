import express from 'express';
import multer from 'multer';
import { deleteController, messageController, messagesController, userController } from '../controllers/ChatController.js';

const router = express.Router();

//Route1: post message to database
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });
router.post('/message', upload.single('imageFile'), messageController)

//route2: get message receiver details
router.get('/user/:userId', userController);

//Route3: get message between two Users
router.get('/messages/:senderId/:recepientId', messagesController)

//Route$: To delete chats
router.post("/delete-messages", deleteController)
export default router;
