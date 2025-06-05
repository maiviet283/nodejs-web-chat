require('dotenv').config()
const cors = require('cors');
const express = require('express')
const connectDB = require('./src/configs/database');
const configViewEngine = require('./src/configs/viewEngine')
const http = require('http')
const socketIO = require('socket.io')

const homeRoutes = require('./src/routes/home.route')
const customerRoutes = require('./src/routes/customer.route')

const app = express()
const server = http.createServer(app)
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

// config req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT
const host_name = process.env.HOST_NAME

// config template engine and static files
configViewEngine(app)

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use('/media/customers', express.static('src/media/customers'));

app.use('/', homeRoutes)
app.use('/api/customers', customerRoutes)


// ==================== Socket.IO ====================

const userSockets = {};

io.on('connection', (socket) => {
    console.log(`🔌 Kết nối: ${socket.id}`);

    socket.on('join', (userId) => {
        // Khởi tạo set nếu chưa có
        if (!userSockets[userId]) {
            userSockets[userId] = new Set();
        }
        userSockets[userId].add(socket.id);
        console.log(`User ${userId} đã join với socket ${socket.id}`);
    });

    socket.on('sendMessage', ({ conversationId, senderId, receiverIds, message }) => {
        const data = { conversationId, senderId, message };

        // Gửi tới tất cả socket của người nhận
        receiverIds.forEach(receiverId => {
            if (userSockets[receiverId]) {
                userSockets[receiverId].forEach(socketId => {
                    io.to(socketId).emit('receiveMessage', data);
                });
            }
        });

        // Gửi lại cho tất cả socket của chính người gửi để đồng bộ các tab
        if (userSockets[senderId]) {
            userSockets[senderId].forEach(socketId => {
                io.to(socketId).emit('receiveMessage', data);
            });
        }
    });

    socket.on('disconnect', () => {
        // Loại bỏ socket này khỏi tất cả user
        for (const userId in userSockets) {
            userSockets[userId].delete(socket.id);
            if (userSockets[userId].size === 0) {
                delete userSockets[userId];
            }
        }
        console.log(`❌ Ngắt kết nối: ${socket.id}`);
    });
});



connectDB().then(() => {
    server.listen(port, host_name, () => {
        console.log(`🚀 Server chạy tại: http://${host_name}:${port}`);
    });
});