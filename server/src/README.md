# Board Location Management API

This Node.js application provides a REST API for updating and managing the geolocation of boards using Firebase for storage. It's built with Express and utilizes various middleware components such as Helmet for security enhancements, CORS for handling cross-origin requests, and Morgan for HTTP request logging.

## Features

- **Real-time Board Location Updates**: Manage board locations with latitude and longitude via REST API.
- **Firebase Integration**: Uses Firebase Admin to store and retrieve board data.
- **Error Handling**: Includes middleware for comprehensive error handling across the API.
- **Environment-Specific Configuration**: Supports different configurations for development and production environments.

## Prerequisites

Before you start, ensure you have the following installed:
- Node.js (v12.x or newer is recommended)
- npm (comes installed with Node.js)
- Access to a Firebase project with a service account key

## Installation

Follow these steps to get your application up and running:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-github-repo/board-location-api.git
   cd board-location-api```
   
2. **Install NPM dependencies**
  ```npm install```
3. **Configure environment variables**
   Create a `.env` file in the root directory and populate it with the necessary Firebase and server settings:
   ```
      FIREBASE_SERVICE_ACCOUNT=<your-firebase-service-account-key-base64>
      DATABASE_URL=<your-firebase-database-url>
      CORS_ORIGIN=<allowed-origin-for-cors>
      PORT=3001
      NODE_ENV=development or production
   ```
5. **Usage**
   To launch the server, use:
   ```
   npm start
   ```
6. **API Endpoints**
   POST `/api/boards/update-location`
Updates the location of a board. This endpoint expects a JSON body with `serialNumber`, `lat`, and `lng`.Example request using curl:

    ```
    curl -X POST http://localhost:3001/api/boards/update-location \
    -H 'Content-Type: application/json' \
    -d '{"serialNumber": "12345", "lat": "34.0522", "lng": "-118.2437"}'
    ```
```
This README.md file provides a comprehensive introduction to your project, details on installation, how to use the API, and additional project management information. It ensures that any new contributors or users can quickly understand and integrate with your project.
```
