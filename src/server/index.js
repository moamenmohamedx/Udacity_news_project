const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from dist directory
app.use(express.static('dist'));

// Logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        apiConfigured: !!(process.env.API_ID && process.env.API_KEY)
    });
});

// POST route for text analysis
app.post('/analyze', async (req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Received analyze request`);
    
    try {
        const { url } = req.body;
        
        // Check if URL is provided
        if (!url) {
            return res.status(400).json({
                error: 'URL is required',
                timestamp
            });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (e) {
            return res.status(400).json({
                error: 'Invalid URL format',
                timestamp
            });
        }

        // Check if API credentials are configured
        if (!process.env.API_ID || !process.env.API_KEY) {
            throw new Error('API credentials are not configured');
        }

        // Make request to Aylien News API v6
        const response = await axios({
            method: 'get',
            url: 'https://api.aylien.com/news/stories',
            headers: {
                'X-AYLIEN-NewsAPI-Application-ID': process.env.API_ID,
                'X-AYLIEN-NewsAPI-Application-Key': process.env.API_KEY,
                'Accept': 'application/json'
            },
            params: {
                source_urls: [url],
                language: ['en'],
                published_at_start: 'NOW-7DAYS',
                published_at_end: 'NOW',
                cursor: '*',
                per_page: 1,
                return: ['title', 'body', 'sentiment', 'source']
            },
            timeout: 10000 // 10 second timeout
        });

        // Extract story and sentiment from response
        const stories = response.data.stories;
        if (!stories || stories.length === 0) {
            throw new Error('No story found for the provided URL');
        }

        const story = stories[0];
        const sentiment = story.sentiment;

        // Format the response
        const result = {
            title: story.title,
            source: story.source.name,
            sentiment: {
                title: {
                    polarity: sentiment.title.polarity,
                    confidence: sentiment.title.confidence
                },
                body: {
                    polarity: sentiment.body.polarity,
                    confidence: sentiment.body.confidence
                }
            },
            summary: story.body
        };

        res.json(result);

    } catch (error) {
        console.error(`[${timestamp}] Error in /analyze endpoint:`, error);
        
        // Get detailed error information
        const errorDetails = error.response?.data || error.message;
        console.error(`[${timestamp}] Error details:`, errorDetails);
        
        // Determine appropriate status code
        const statusCode = error.response?.status || 500;
        
        // Send a more detailed error response
        res.status(statusCode).json({
            error: 'Error analyzing the text',
            details: JSON.stringify(errorDetails),
            type: error.name,
            timestamp
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Global error handler caught:`, err);
    
    res.status(500).json({
        error: 'Internal server error',
        timestamp
    });
});

// Start server
const port = process.env.PORT || 8082;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
