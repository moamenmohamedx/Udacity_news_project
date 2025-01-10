import { handleSubmit } from '../formHandler';

describe('Form Handler Tests', () => {
    test('handleSubmit function should be defined', () => {
        expect(handleSubmit).toBeDefined();
    });

    // Mock the fetch function
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({
                title: 'Test Article',
                source: 'Test Source',
                sentiment: {
                    title: { polarity: 'positive', confidence: 0.9 },
                    body: { polarity: 'neutral', confidence: 0.8 }
                },
                summary: 'Test summary'
            })
        })
    );

    // Mock DOM elements
    document.body.innerHTML = `
        <input id="url" value="https://example.com" />
        <div id="results"></div>
        <button type="submit">Submit</button>
    `;

    test('handleSubmit should process valid URLs', async () => {
        const event = { preventDefault: () => {} };
        await handleSubmit(event);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8082/analyze', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: 'https://example.com' })
        });
    });

    test('handleSubmit should handle invalid URLs', () => {
        document.getElementById('url').value = 'invalid-url';
        const event = { preventDefault: () => {} };
        handleSubmit(event);
        expect(document.getElementById('results').innerHTML).toContain('Please enter a valid URL');
    });
});
