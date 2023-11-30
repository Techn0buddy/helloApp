import User from "../models/User.js";
    
export const friendRequestController = async (req, res) => {
    try {
        const { currUserId, selectedUserId } = await req.body;
        //update the friend request array
        //reciever
        const receiver = await User.findByIdAndUpdate(selectedUserId, {
            $push: { friendRequests: currUserId }
        })
        
        //sender
        const sender = await User.findByIdAndUpdate(currUserId, {
            $push: { sentFriendRequests: selectedUserId }
        })

        console.log(sender, receiver);
        res.status(200).send({
            success: true,
            message: "Friend request send successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export const friendRequestsController = async (req, res) => {
    try {
        const { userId } = await req.params;

        //fetch the user from the database;
        const user = await User.findById(userId).populate('friendRequests', "name email image").lean();

        const friendRequests = user.friendRequests

        res.status(200).json({
            success: true,
            friendRequests
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};

export const friendAcceptController = async (req, res) => {
    try {
        const { senderId, recepientId } = req.body;
        //retrieve the documents of the sender and recepient
        const sender = await User.findById(senderId);
        const recepient = await User.findById(recepientId);

        sender.friends.push(recepientId);
        recepient.friends.push(senderId);

        recepient.friendRequests = recepient.friendRequests.filter((request) => request.toString() !== senderId.toString());
        sender.sentFriendRequests = sender.sentFriendRequests.filter((request) => request.toString() !== recepientId.toString());

        await sender.save();
        await recepient.save();

        res.status(200).json({
            success: true,
            message: "Friend Request Accepted SuccessFully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};

export const friendsController = async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate(
          "friends",
          "name email image"
      );

      const acceptedFriends = user.friends;
      res.status(200).json(acceptedFriends);


  } catch (error) {
      console.log(error);
      res.status(500).json({
          success: true,
          message: "Internal Server Error"
      })
  }  
};

export const friendStatusController = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("sentFriendRequests", "name email image").lean();

        const sentFriendRequests = user.sentFriendRequests;
        res.status(200).json(sentFriendRequests);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: true,
            message: "Internal Server Error",
        });
    }
};

export const getFriendsController = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findById(userId).populate("friends").then((user) => {
            if (!user) {
                return res.status(404).json({ message: "user not found" });
            }
            const friendsIds = user.friends.map((friend) => friend._id);    
            res.status(200).json(friendsIds);
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
          success: true,
          message: "Internal Server Error",
        });
    }   
}