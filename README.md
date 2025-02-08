# Redis Session PubSub Manager

## Overview

This project showcases lightweight, scalable session management with Redis Sets and Pub/Sub, enabling real-time communication in session-based applications. Built with Express, the application provides robust CRUD operations for session and user management. Once a session is created and joined, Pub/Sub enables real-time updates and messaging between users. The project leverages Redis for efficient data handling, with future plans to transition toward WebSockets for event-driven updates.

## Features

- Lightweight, scalable session management using Redis Sets and Pub/Sub integration.
- Built with Express to provide RESTful CRUD operations for session and user management.
- Ability to create and join sessions with unique codes and user IDs, providing basic session authentication.
- Real-time messaging between users within sessions, powered through Pub/Sub synchronization.
- Efficient tracking of sessions and users using Redis Sets, key patterns, and expiration policies.
- Error handling middleware and custom error classes.

## Data Structure Overview

The application uses Redis to manage session and user data with the following structure:

- **Redis Set:**

  - Each session is stored as a Redis Set with the key `session:<code>`.
  - The session Set contains unique user keys in the format `user:<userId>`.

- **Key Patterns:**

  - The pattern `session:<code>` is used as the session identifier and allows for quick retrieval of session members.
  - The `user:<userId>` pattern represents individual users in the session.

- **Pub/Sub Integration:**

  - Pub/Sub channels are derived from session keys, ensuring a seamless connection between session data and messaging functionality.
  - **Example channel:** `session:4567` would manage message broadcasting for the session with code `4567`.

## Setup

### Prerequisites

- Node.js (v18 or higher)
- Redis (local or cloud-based)

### Dependencies

- **express:** web framework for building the API
- **redis:** redis client for data storage and communication
- **dotenv:** environment variable management
- **morgan:** HTTP request logger
- **nodemon (dev dependency):** live reload for development

### Installation

1. Clone the repository:

```bash
git clone https://github.com/vincentpchevalier/redis-session-pubsub.git
cd redis-session-pubsub
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

- Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

- Update the `.env` file with your Redis URL and other settings. Example:

```bash
SESSION_KEY=session:
USER_KEY=user:
TTL_EXPIRATION=3600
```

### Running the Application

This project is optimal when running two server instances to handle Redis Pub/Sub functionality properly. While each server can act as both a publisher and a subscriber, this setup is intended as a demonstration of Redis Pub/Sub capabilities and is designed to be accessed by different clients to simulate real-world interactions. Running two instances ensures proper behavior and enables testing of Pub/Sub mechanics in a controlled environment.

**Starting Two Servers:**

1.  Start the first server (e.g., on port 3000):

```bash
APP_PORT=3000 npm start

```

2. Start the second server (e.g., on port 4000):

```bash
APP_PORT=4000 npm start
```

Each server will log its listening port and operate independently, sharing the same Redis instance.

## API Endpoints

### Session Management

**1. POST /session:** Create a new session.

- A session is created with the user as the first member.
- User ID is required in the request body.
- A unique code is generated and returned in the response.

**Request Body:**

```json
{
	"userId": "user123"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Session created.",
	"data": { "code": "4567" }
}
```

**2. POST /session/join:** Join an existing session.

- The user is added to the open session.
- Session code and unique (non-existing) user ID are required in the request body.
- Only two users can join a session at the same time otherwise an error is returned.

**Request Body:**

```json
{
	"userId": "person789",
	"code": "4567"
}
```

**Response:**

```json
{
	"success": true,
	"message": "person789 joined session 4567"
}
```

**3. POST /session/message:** Send a message to the members of the open session.

- A message is published to all users in the session.
- Session code and user ID are required in the request body.
- NB: In the current version, the message is logged in the console.

**Request Body:**

```json
{
	"message": "everything in its right place...",
	"code": "4567",
	"userId": "user123"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Message sent."
}
```

**4. PUT /session/leave:** Leave the open session.

- The user is removed from the session.
- Session code and user ID are required in the request body.
- Once a user leaves the session, they are no longer able to receive published messages.
- The session remains open for the other user. It can be joined later by another user.

**Request Body:**

```json
{
	"userId": "person789",
	"code": "4567"
}
```

**Response:**

```json
{
	"success": true,
	"message": "person789 left session 4567"
}
```

**5. DELETE /session/close:** Close the open session for all users.

- Session code and valid user ID is required in the request body.
- Once a session is closed, it cannot be joined by another user.
- This disconnects all users from pub/sub clients and deletes the session from Redis cache.

**Request Body:**

```json
{
	"userId": "user123",
	"code": "4567"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Session 4567 has been closed and is no longer valid."
}
```

## Future Improvements

- Add unit tests for critical services.
- Full development and production-level logging for debugging and monitoring.
- Add WebSockets for event-driven updates.
- Full user authentication and authorization for secure access.
- Implement rate-limiting to prevent abuse of endpoints.
- Store old sessions and associated data in a persistent database system like MongoDB for historical tracking and analysis.
- Enhance session status tracking with additional APIs.

## License

This project is under the MIT License. See the [LICENSE](LICENSE) file for details.
