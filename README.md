# MERN Chat Application

This is a simple chat application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to chat in real-time.

## Features

- User Registration and Authentication
- Create and Join Chat Rooms
- Real-time Messaging
- User Online/Offline Status
- Typing Indicators

## Technologies Used

- MongoDB: A NoSQL database used to store user data and chat messages.
- Express.js: A web application framework for building the server-side logic.
- React.js: A JavaScript library for building the user interface.
- Node.js: A runtime environment for executing JavaScript on the server.
- Socket.io: A library for enabling real-time, bidirectional communication between clients and the server.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Deepayan03/Chat-Application.git)https://github.com/Deepayan03/Chat-Application.git
2. Install dependencies for the server:
    ```bash
    cd server
    npm install
3. Create a .env file in the server directory with the following configuration:
    ```bash
    PORT=3001
    MONGODB_URI=<your-mongodb-uri>
    SECRET_KEY=<your-secret-key>
    PORT: The port on which the server will run.
    MONGODB_URI: The URI for your MongoDB database.
    SECRET_KEY: A secret key for JWT token generation.
4. Start the server:
   ```bash
   npm start
5. Install dependencies for the client:
     ```bash
     cd client
    npm install
6. Start the client:
    ```bash
    Copy code
    npm start
7. Access the chat application in your web browser at http://localhost:3000.

8. Usage
    Register a new account or log in with an existing account.
    Create or join chat rooms.
    Start chatting with other users in real-time.
    View the online status of other users.
    See typing indicators when other users are typing.

9. Contributing
    Contributions are welcome! 
