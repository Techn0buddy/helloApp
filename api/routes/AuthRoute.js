import express from 'express';
import { fetchUsersController, loginController, registerController } from '../controllers/AuthController.js';

//Router Object
const router = express.Router();

//Routes
//Route1: Register, Method: POST, api/v1/auth/register
router.post('/register', registerController);

//Route2: Login, Method: POST,
router.post('/login', loginController);

//Route3: Fetch All Users, Method: GET,
router.get("/users/:userId", fetchUsersController);

export default router;
