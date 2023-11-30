import { comparePassword, hashPassword } from "../helper/authHelper.js";
import UserModel from "../models/User.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    //check if all required field not empty
    if (!name) {
      return res.send({ message: "name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!image) {
      return res.send({ message: "image is required" });
    }

    //check for existing user
    const existingUser = await UserModel.findOne({ email });

    //if existing user found
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exist. Please Login",
      });
    }

    //if new user
    const hashedPassword = await hashPassword(password);

    //save
    const user = await new UserModel({
      name,
      email,
      password: hashedPassword,
      image,
    }).save();

    return res.status(201).send({
      success: true,
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error in registration",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    //find for user
    const user = await UserModel.findOne({ email });

    //if user not found
    if (!user) {
      return res.status(404).send({
        success: false,
        message: `Account doesn't exist. Register for new account`,
      });
    }
      //if user exist. Check for password
    const match = await comparePassword(password, user?.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    //   token
    const authToken = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //sending back response
    return res.status(200).send({
      success: true,
      message: "Login Successfull",
      user: {
        name: user.name,
        email: user.email,
        image: user.image
      },
      authToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error in registration",
    });
  }
};

export const fetchUsersController = async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    UserModel.find({ _id: { $ne: loggedInUserId } }).then((users) => {
      res.status(200).json({
        success: true,
        message: "users fetched successfully",
        users,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Internal server error'
    })
  }
  
}