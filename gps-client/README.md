# Smart Waste Client

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)

## Introduction<a name="introduction"></a>

Our client is developed using React and scaffolded with `create-react-app`. It provides the user interface for interacting with the Smart Waste management system, allowing users to monitor and manage waste collection services efficiently.

## Installation<a name="installation"></a>

To set up the client for development or deployment, follow these steps:

1. Navigate to the `gps-client/` directory:
    ```sh
    cd gps-client/
    ```
    
2. Install the project dependencies:
    ```sh
    npm install
    ```

## Usage<a name="usage"></a>

For development purposes, you can run the client in:
- **Standard Development Mode**:
    ```sh
    npm start
    ```
    This mode runs the client with calls to the actual backend enabled, suitable for full-stack development and testing.

## Folder Structure<a name="folder-structure"></a>

The client project is organized as follows:
# GPS Client Project Structure Overview

This document outlines the primary directories and their functions within the GPS Client application.

## Key Directories and Their Functions

- **`public/`**: Contains static assets that are publicly accessible, including the entry HTML file, favicon, logos, manifest, and robots.txt.

- **`src/`**: Main source directory for the application's codebase:
  - **`assets/`**: Stores static images like icons and user avatars.
  - **`auth/`**: Manages user authentication configurations, including Firebase.
  - **`component/`**: Reusable React components such as buttons, forms, and headers.
  - **`context/`**: React contexts for global state management.
  - **`db/`**: Scripts for database interactions.
  - **`hooks/`**: Custom React hooks for sharing logic and state.
  - **`pages/`**: Components representing different views or routes like Dashboard and Login.
  - **`styles/`**: CSS for specific components.
  - **`types/`**: TypeScript definitions and interfaces for type safety.

- **`README.md`**: Documentation for the project, providing setup and usage instructions.

- **`package.json`** & **`package-lock.json`**: Define NPM dependencies and scripts.

- **`tsconfig.json`**: TypeScript compiler configuration file.

## Files Description

Each file and directory has a specific role:

- **`public/index.html`**: The main HTML document that serves as the entry point for the application.
- **`src/index.tsx`**: Bootstrap and entry file for the React application.
- **`src/App.tsx`**: Root component that houses the basic structure and routing of the app.

## Summary

This structure ensures the GPS Client application is organized and modular, making development and maintenance efficient and scalable.
