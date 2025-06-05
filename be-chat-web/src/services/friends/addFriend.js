const Friendship = require('../../models/friends.model');

const sendFriendRequestService = async (requesterId, recipientId) => {
    if (requesterId === recipientId) {
        throw new Error("Không thể gửi lời mời kết bạn chính mình.");
    }

    const existing = await Friendship.findOne({
        $or: [
            { requester: requesterId, recipient: recipientId },
            { requester: recipientId, recipient: requesterId }
        ]
    });

    if (existing) {
        throw new Error("Đã có mối quan hệ tồn tại giữa 2 người dùng.");
    }

    const newRequest = new Friendship({
        requester: requesterId,
        recipient: recipientId,
        status: 'pending'
    });

    await newRequest.save();
    return newRequest;
};

module.exports = {
    sendFriendRequestService
};
