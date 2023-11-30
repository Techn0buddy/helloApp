import User from '../models/User.js';
import Message from './../models/Message.js'
export const messageController = async (req, res) => {
    try {
        const { senderId, recepientId, messageType, messageText } = req.body;
        console.log(senderId, recepientId);
              console.log("REQUEST = ", req.body);

        const newMessage =  new Message({
          senderId,
          recepientId,
          messageType,
          messageText,
          timeStamp: new Date(),
          imageUrl: messageType === "image" ? req.file.path: null,
        });
        console.log("Image = ",newMessage.imageUrl);
        await newMessage.save();

        res.status(200).json({
            success: true,
            message: 'Message sent successfully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};

export const userController = async (req, res) => {
    try {
        const { userId } = req.params;
        const recepientId = await User.findById(userId);
        res.status(200).json({
            success: true,
            message: 'Recepient details fetched successfully',
            recepientId
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};

export const messagesController = async (req, res) => {
    try {
        const { senderId, recepientId } = req.params;

        const messages = await Message.find({
          $or: [
            { senderId: senderId, recepientId: recepientId },
            { senderId: recepientId, recepientId: senderId },
          ],
        }).populate("senderId", "_id name");

        console.log(messages);
        res.json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};

export const deleteController = async (req, res) => {
    try {
        const { messages } = req.body;
        if (!Array.isArray(messages) || messages.length === 0)
            return res.status(400).json({
                success: false,
                message: "Invalid reqeust body"
            })
        
        await Message.deleteMany({_id: {$in:messages}})
        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}