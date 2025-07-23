# CoDraw Game Server

## Introduction

CoDraw is a multiplayer online drawing game that allows users to collaborate in real-time on a shared canvas. This document provides instructions for setting up and running the game server.

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd codraw-app/game_server
   ```

2. Install the required dependencies:

   ```
   npm install
   ```

3. Configure the server settings by editing the `config.json` file. Ensure that you set the appropriate parameters for your environment.

## Running the Server

To start the game server, run the following command:

```
node server.js
```

The server will start and listen for incoming connections. You can access the server through the specified port in your `config.json`.

## Usage

- Once the server is running, users can connect to it via the frontend application.
- Users can create or join drawing sessions, collaborate in real-time, and save their drawings.

## Features

- Dynamic server creation and management.
- Real-time drawing synchronization using WebSockets.
- Immortalization of drawings for later viewing.

## Troubleshooting

If you encounter any issues while running the server, please check the following:

- Ensure that all dependencies are installed correctly.
- Verify that the server is running on the correct port.
- Check the console for any error messages.

## Contribution

Feel free to contribute to the project by submitting issues or pull requests. Your feedback and contributions are welcome!

## License

This project is licensed under the MIT License. See the LICENSE file for more details.