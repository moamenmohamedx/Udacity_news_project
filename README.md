# News Article Analyzer

Hey! This is my News Article Analyzer project for the Udacity Front End Nanodegree. It analyzes articles using Natural Language Processing to determine their sentiment and tone.

## Quick Start

### Install
```bash
npm install
```

### Set Up API
1. Create a `.env` file in the root directory
2. Add your Aylien API credentials:
```
API_ID=your_api_id_here
API_KEY=your_api_key_here
PORT=8082
```

### Run
Development mode:
```bash
npm run build-dev
```

Production mode:
```bash
npm run start-prod
```

Run tests:
```bash
npm test
```

## Features
- URL validation
- Sentiment analysis (positive/negative/neutral)
- Offline functionality with service workers
- Error handling
- Responsive design

## Tech Used
- Webpack (dev & prod configs)
- Sass for styling
- Express server
- Jest for testing
- Service Workers
- Aylien API

## Project Structure
```
src/
├── client/
│   ├── js/
│   ├── styles/
│   └── views/
└── server/
```

## License
ISC
