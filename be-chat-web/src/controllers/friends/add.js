const { sendFriendRequestService } = require('../../services/friends/addFriend');

const sendFriendRequest = async (req, res) => {
    try {
        const requesterId = req.user._id; // từ token
        const { recipientId } = req.body;

        const friendship = await sendFriendRequestService(requesterId, recipientId);
        res.status(201).json({
            message: "Đã gửi lời mời kết bạn thành công.",
            friendship
        });
    } catch (error) {
        res.status(400).json({ message: error.message || "Lỗi gửi lời mời." });
    }
};

module.exports = {
    sendFriendRequest
};
