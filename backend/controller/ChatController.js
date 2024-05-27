const { Chat } = require("../Models/ChatModels")
const { User } = require("../Models/UserModel")


const accessChat = async (req, res) => {
    const { userID, id } = req.body
    const chat = await Chat.find({
        isGroupChat: false,
        users: { $all: [userID, id] }
    }).populate('users', '-password');

    if (chat.length === 0) {
        let newChat = await Chat.create({
            isGroupChat: false,
            users: [userID, id],
            chatName: "sender"
        });

        newChat = await newChat.populate('users', '-password');
        res.send(newChat);
    }
    else {
        res.send(chat)
    }
}

const fetchChat = async (req, res) => {
    const { userID } = req.query;
    const AllChats = await Chat.find({
        users: { $in: [userID] }
    }).populate('users', '-password').sort({
        updatedAt: -1
    });
    res.send(AllChats)
}

const updateLatestMessage = async (req, res) => {
    const { chatID, messageID } = req.body;

    const updatedChat = await Chat.updateOne({
        _id: chatID,
    }, {
        $set: {
            latestMessage: messageID
        }
    })

    res.send(updatedChat);
}

const createGroupChat = async (req, res) => {
    const { groupChatName, users, userID } = req.body;

    const AllUser = [...users, userID];

    if (AllUser.length < 2) {
        res.send({
            msg: "Atleast 3 member"
        })
    }
    else {
        let FullUser = [];
        for (var i = 0; i < AllUser.length; i++) {
            const user = await User.find({
                _id: AllUser[i]
            }).select('-password')
            FullUser.push(user)
        }

        let GroupAdmin = await User.find({
            _id: userID
        }).select('-password')

        const obj = {
            chatName: groupChatName,
            isGroupChat: true,
            users: AllUser,
            groupAdmin: userID
        }
        const createdGroup = await Chat.create(obj);
        res.send({
            _id: createdGroup._id,
            users: FullUser,
            groupAdmin: GroupAdmin,
            chatName: groupChatName
        })
    }
};

const renameGroup = async (req, res) => {
    const { chatID, newGroupName } = req.body;

    try {
        const updatedGroup = await Chat.findOneAndUpdate(
            { _id: chatID },
            { $set: { chatName: newGroupName } },
            { new: true }
        ).populate('users', '-password').populate("groupAdmin", "-password");

        if (!updatedGroup) {
            return res.status(404).send({ error: "Group not found" });
        }

        res.send(updatedGroup);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const addToGroup = async (req, res) => {
    const { chatID, id } = req.body;

    try {
        const updatedGroup = await Chat.findOneAndUpdate(
            { _id: chatID },
            { $push: { users: id } },
            { new: true }
        ).populate('users', '-password').populate('groupAdmin', '-password');

        if (!updatedGroup) {
            return res.status(404).send({ error: "Group not found" });
        }

        res.send(updatedGroup);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const removeFromGroup = async (req, res) => {
    const { chatID, id } = req.body;

    try {
        const updatedGroup = await Chat.findOneAndUpdate(
            { _id: chatID },
            { $pull: { users: id } },
            { new: true }
        ).populate('users', '-password').populate('groupAdmin', '-password');

        if (!updatedGroup) {
            return res.status(404).send({ error: "Group not found" });
        }

        res.send(updatedGroup);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    accessChat,
    fetchChat,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
    updateLatestMessage
}