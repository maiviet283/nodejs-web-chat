## Ứng dụng Chat Thời Gian Thực

**Tên dự án**: Real-Time Chat App
**Chức năng chính**: Kết bạn – Nhắn tin thời gian thực – Giao diện đơn giản dễ dùng

### 🎯 Mục tiêu

Xây dựng một ứng dụng chat đơn giản nhưng mạnh mẽ, cho phép người dùng:

* Đăng ký / đăng nhập
* Gửi và nhận tin nhắn theo thời gian thực
* Kết bạn và trò chuyện riêng tư giữa các người dùng

### 🧱 Cấu trúc Dự án

```
.
├── be-chat-web/   # Thư mục chứa mã nguồn backend
├── fe-chat-web/   # Thư mục chứa mã nguồn frontend
```

---

### 🔧 Công nghệ sử dụng

#### Backend – `be-chat-web`

* **Node.js** & **Express**: Xây dựng API RESTful và quản lý routing.
* **WebSocket (socket.io)**: Giao tiếp thời gian thực giữa các client.
* **MongoDB (Mongoose)**: Lưu trữ thông tin người dùng, bạn bè và tin nhắn.

#### Frontend – `fe-chat-web`

* **React.js**: Giao diện hiện đại, phản hồi nhanh.
* **Socket.IO Client**: Kết nối WebSocket với server để nhận/gửi tin nhắn tức thì.
* **Context API / useState / useEffect**: Quản lý trạng thái và dữ liệu người dùng.

