import express from "express";
import { friendAcceptController, friendRequestController, friendRequestsController, friendStatusController, friendsController, getFriendsController } from "../controllers/FriendController.js";

const router = express.Router();

//Route1: Send a friend request
router.post('/friend-request', friendRequestController);

//Route2: Show all friend Requests for a particular User
router.get('/friend-requests/:userId', friendRequestsController);

//Route3: Accept a friend request
router.post('/friend-request/accept', friendAcceptController);

//Route4: To show all friends of the curruser
router.get('/accepted-friends/:userId', friendsController);

//Route5: To get the status of friend request btn
router.get('/friend-requests/sent/:userId', friendStatusController);

//Router: To get thefriend 
router.get('/friends/:userId', getFriendsController)
export default router;
