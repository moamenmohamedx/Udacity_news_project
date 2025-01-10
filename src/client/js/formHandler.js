import { checkForName } from './nameChecker';

// Server URL for API requests
const serverURL = 'http://localhost:8082';

// Get the form element and add an event listener for form submission
const form = document.getElementById('urlForm');
form.addEventListener('submit', handleSubmit);

// Helper function to validate URL format
function isValidUrl(url) {
    try {
        new URL(url);
        return url.match(/^https?:\/\/.+\..+/i) !== null;
    } catch {
        return false;
    }
}

// Function to display a message to the user
function showMessage(message, type = 'error') {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="message ${type}">
            <p>${type === 'error' ? '❌' : '✓'} ${message}</p>
            ${type === 'error' ? '<p>Please try again with a different URL or contact support if the problem persists.</p>' : ''}
        </div>
    `;
}

// Function to show the loading state
function showLoadingState() {
    const submitButton = document.querySelector('button[type="submit"]');
    const resultsDiv = document.getElementById('results');
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner"></span> Analyzing...';
    resultsDiv.innerHTML = '<div class="loading">Analyzing article, please wait...</div>';
}

// Function to reset the loading state
function resetLoadingState() {
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.innerHTML = 'Analyze Article';
}

// Function to display the analysis results
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    
    // Format confidence scores with fallback
    const formatConfidence = (confidence) => {
        if (confidence === undefined || confidence === null) {
            return '';  // Return empty string if confidence is not available
        }
        return `<span class="confidence">${(confidence * 100).toFixed(1)}% confidence</span>`;
    };
    
    // Get sentiment emoji
    const getSentimentEmoji = (polarity) => {
        switch(polarity.toLowerCase()) {
            case 'positive': return '😊';
            case 'negative': return '😟';
            default: return '😐';
        }
    };

    const titleEmoji = getSentimentEmoji(data.sentiment.title.polarity);
    const bodyEmoji = getSentimentEmoji(data.sentiment.body.polarity);

    resultsDiv.innerHTML = `
        <div class="analysis-results">
            <h2>${data.title}</h2>
            <p class="source"><strong>Source:</strong> ${data.source}</p>
            
            <div class="sentiment-box">
                <h3>Title Sentiment ${titleEmoji}</h3>
                <p class="sentiment ${data.sentiment.title.polarity.toLowerCase()}">
                    ${data.sentiment.title.polarity}
                    ${formatConfidence(data.sentiment.title.confidence)}
                </p>
            </div>

            <div class="sentiment-box">
                <h3>Article Sentiment ${bodyEmoji}</h3>
                <p class="sentiment ${data.sentiment.body.polarity.toLowerCase()}">
                    ${data.sentiment.body.polarity}
                    ${formatConfidence(data.sentiment.body.confidence)}
                </p>
            </div>

            <div class="summary-box">
                <h3>Article Summary</h3>
                <p>${data.summary}</p>
            </div>
        </div>
    `;
}

// Handle form submission
async function handleSubmit(event) {
    event.preventDefault();

    // Get input value
    const formText = document.getElementById('url').value.trim();
    
    // Validate empty input
    if (!formText) {
        showMessage('Please enter a URL to analyze');
        return;
    }

    // Validate URL format
    if (!isValidUrl(formText)) {
        showMessage('Please enter a valid URL');
        return;
    }

    // Show loading state
    showLoadingState();

    try {
        // Make API request to analyze the article
        const response = await fetch(`${serverURL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: formText })
        });

        // Check if the response was successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Get the analysis results
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        // Display an error message if something went wrong
        showMessage('Error analyzing the article. Please try again.');
        console.error('Error:', error);
    } finally {
        // Reset the loading state
        resetLoadingState();
    }
}

// Export the handleSubmit and isValidUrl functions
export { handleSubmit, isValidUrl };
