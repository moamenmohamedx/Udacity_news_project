import { isValidUrl } from './formHandler';

describe('Form Validation', () => {
    beforeEach(() => {
        // Clear any mocks before each test
        jest.clearAllMocks();
    });

    test('isValidUrl validates URLs correctly', () => {
        // Valid URLs
        expect(isValidUrl('https://www.example.com')).toBeTruthy();
        expect(isValidUrl('http://example.com')).toBeTruthy();
        expect(isValidUrl('https://subdomain.example.com/path')).toBeTruthy();

        // Invalid URLs
        expect(isValidUrl('not-a-url')).toBeFalsy();
        expect(isValidUrl('http:/example.com')).toBeFalsy();
        expect(isValidUrl('')).toBeFalsy();
    });
});
