## System Design for LivePoll

#### 1. **Features**
   - **User Authentication:** Users can log in, create polls, and vote. Authenticated users can bookmark polls.
   - **Create Polls:** Users can create polls with options for others to vote on.
   - **Real-Time Voting & Visualization:** Live updates for ongoing polls and dynamic visualizations using charts.
   - **Bookmark Polls:** Users can bookmark polls to view or participate in later.
   - **View Past Participation:** A history of polls the user participated in.

#### 2. **Frontend (React)**

   - **React Components**:
      - **Login/Register Page:** For user authentication.
      - **Dashboard:** Displays polls created by the user and polls they bookmarked.
      - **Poll Creation Page:** Allows users to create a new poll with title, description, and options.
      - **Poll Display Page:** Shows the poll with voting options, live updates on votes, and a visualization of the voting progress (e.g., bar chart or pie chart).
      - **Bookmarks Page:** Displays a list of bookmarked polls.
   
   - **Real-Time Voting Updates**:
      - Use **Socket.io** or **WebSockets** to enable real-time updates. When a user votes, the data is sent to the server and then broadcast to other connected clients, updating the visualization immediately.

#### 3. **Backend (Node.js + Express)**

   - **API Endpoints**:
      - **Auth Routes**:
         - `POST /api/auth/register`: User registration.
         - `POST /api/auth/login`: User login.
      - **Poll Routes**:
         - `POST /api/polls`: Create a new poll.
         - `GET /api/polls/:pollId`: Get poll details, including live vote count.
         - `POST /api/polls/:pollId/vote`: Submit a vote for a poll.
         - `GET /api/polls/bookmarked`: Retrieve all bookmarked polls for a user.
         - `POST /api/polls/:pollId/bookmark`: Bookmark a poll.
      - **User Routes**:
         - `GET /api/user/history`: Get a list of polls the user has participated in.
   
   - **Real-Time Updates**:
      - **Socket.io**: When a vote is cast, the server broadcasts the updated vote count to all connected clients subscribed to that poll. This ensures real-time updates on each client.

#### 4. **Database (MongoDB)**

   - **Collections**:
      - **Users**: Stores user information, bookmarks, and participated polls.
      - **Polls**: Contains details of each poll, options, votes, and the creator’s user ID.
      - **Votes**: Each document records a vote with a user ID, poll ID, and option ID.
      - **Bookmarks**: Stores references to polls a user has bookmarked.

   - **Schema Design**:
      - **User Schema**:
         ```javascript
         {
            _id: ObjectId,
            username: String,
            password: String, // hashed
            bookmarks: [pollId],
            history: [pollId]
         }
         ```
      - **Poll Schema**:
         ```javascript
         {
            _id: ObjectId,
            title: String,
            description: String,
            options: [
               { optionId: ObjectId, text: String, voteCount: Number }
            ],
            creatorId: ObjectId,
            createdAt: Date
         }
         ```
      - **Vote Schema**:
         ```javascript
         {
            _id: ObjectId,
            userId: ObjectId,
            pollId: ObjectId,
            optionId: ObjectId
         }
         ```

#### 5. **Real-Time Voting with Socket.io**

   - **Workflow**:
      - When a user votes on a poll, the frontend triggers a `vote` event via **Socket.io**.
      - The server receives this event, updates the vote count in the database, and broadcasts the updated vote count to all clients connected to that poll.
      - This enables real-time visualization as each client receives the updated poll data without refreshing the page.

#### 6. **Chart Visualization**

   - **Frontend Visualization**:
      - Use **Chart.js** or **D3.js** to create charts that display poll results.
      - As Socket.io sends updates, the poll display page refreshes the chart data dynamically, showing live vote changes.

#### 7. **Bookmarking & Poll History**

   - **Bookmarking a Poll**:
      - When a user bookmarks a poll, the poll ID is added to their bookmarks in the `Users` collection.
      - The bookmarks page fetches all polls that match the bookmarked poll IDs and displays them.
   
   - **Poll History**:
      - Each vote by a user is recorded, with the poll ID added to their `history` field in the `Users` collection.
      - This allows users to view past polls they participated in.

### System Diagram

A basic diagram for this system would include:

1. **Frontend (React)**: Login/Register Page, Dashboard, Poll Creation Page, Poll Display Page with charts, Bookmark and History pages.
2. **Backend (Express)**: API endpoints for user actions (vote, create poll, bookmark), real-time voting handled by Socket.io.
3. **Database (MongoDB)**: Stores collections for users, polls, votes, and bookmarks.
4. **Socket.io/WebSocket**: Handles real-time updates from the server to the clients as votes come in.

## To go from deployed to local:
- change the backend .env url to `http://localhost:3000`
- chnage the axios base url to `http://localhost:3000/api/v1`
- change the io url in the vottingPage to `http://localhost:3000`