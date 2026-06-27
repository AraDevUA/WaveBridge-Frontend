# WaveBridge Frontend

WaveBridge is a React-based frontend for a music transfer application. It allows users to move playlists and liked tracks between streaming platforms such as Spotify, YouTube Music, and SoundCloud.

The app provides authentication, transfer history, service selection, and integration with a backend API for managing music transfer workflows.

## Features

- User registration and login
- Google authentication flow
- Music transfer service selection
- Support for Spotify, YouTube Music, and SoundCloud
- Transfer history with status tracking
- Responsive UI built with Material UI
- API client with token-based authentication

## Tech Stack

- React
- Vite
- React Router
- Material UI
- JavaScript
- CSS
- ESLint

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

The app will be available at the local URL shown in the terminal.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Linting

```bash
npm run lint
```

## API Configuration

The frontend currently connects to the backend API at:

```js
https://localhost:7270
```

This value is defined in:

```txt
src/shared/api/apiClient.jsx
```

Make sure the backend server is running before using authentication or transfer-related features.

## Project Structure

```txt
src/
  app/              Application routes and root app setup
  assets/           Service icons and static assets
  features/         Feature pages such as home, auth, and dashboard
  shared/
    api/            API clients and service methods
    hooks/          Reusable React hooks
    ui/             Shared UI components
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Status

This project is under active development. Current functionality focuses on authentication, service selection, and transfer history UI.
