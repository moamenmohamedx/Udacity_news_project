// Setup file for Jest tests
global.fetch = jest.fn();

// Mock DOM environment
document.body.innerHTML = `
    <form id="urlForm">
        <input id="url" type="text" name="url">
        <button type="submit">Submit</button>
    </form>
    <div id="results"></div>
`;

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});
