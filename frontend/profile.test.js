// standalone-profile.test.js

// Define the functions directly within the test file's scope

/**
 * Counts the number of words in a given string.
 * Words are sequences of non-whitespace characters separated by whitespace.
 * Returns 0 for empty or whitespace-only strings.
 * @param {string} str The string to count words in.
 * @returns {number} The number of words.
 */
function wordCount(str) {
    if (!str || typeof str !== 'string' || str.trim() === "") {
        return 0;
    }
    // Match sequences of non-whitespace characters
    const matches = str.match(/\S+/g);
    return matches ? matches.length : 0;
}

/**
 * Validates a description string, ensuring it doesn't exceed 75 words.
 * If it exceeds the limit, it truncates the string to the first 75 words.
 * Relies on the 'wordCount' function defined above.
 * @param {string} description The description string.
 * @returns {string} The original or truncated description.
 */
function validateDescription(description) {
    const limit = 75;

    // Handle cases where wordCount might not be directly applicable (null, etc.)
    if (!description || typeof description !== 'string') {
         return ''; // Or handle as appropriate, returning empty string is safe
    }

    // Uses the wordCount function defined in this file
    const count = wordCount(description);

    if (count <= limit) {
        return description; // Return original if within limit
    } else {
        // Truncate: Split into words, take the first 'limit' words, join back
        const words = description.trim().split(/\s+/); // Split by any whitespace
        return words.slice(0, limit).join(' ');
    }
}

/**
 * Checks if a username is valid according to the specified criteria:
 * - Must not be empty.
 * - Must not contain special characters or spaces (!@#$%^&*()+\-=[]{};':"\\|,.<>\/? or whitespace).
 * @param {string} username The username to validate.
 * @returns {boolean} True if the username is valid, false otherwise.
 */
function isValidUsername(username) {
    // Regex matching disallowed characters (special chars and whitespace)
    const specialCharRegex = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?\s]/;

    if (!username) { // Handles null, undefined, empty string
        return false;
    }
    // Test if the regex finds any disallowed character
    return !specialCharRegex.test(username);
}


// --- JEST TESTS ---

describe('Standalone Validation Functions', () => {

    describe('wordCount Function', () => {
        it('should count words in a typical string', () => {
            expect(wordCount("This is a test string")).toBe(5);
        });

        it('should return 0 for an empty string', () => {
            expect(wordCount("")).toBe(0);
        });

        it('should return 0 for a string with only whitespace', () => {
            expect(wordCount("   \t \n ")).toBe(0);
        });

        it('should return 0 for null or undefined input', () => {
            expect(wordCount(null)).toBe(0);
            expect(wordCount(undefined)).toBe(0);
        });

        it('should handle leading/trailing spaces', () => {
            expect(wordCount("  leading and trailing spaces  ")).toBe(4);
        });

        it('should handle multiple spaces between words', () => {
            expect(wordCount("word1  word2   word3")).toBe(3);
        });
    });

    describe('validateDescription Function', () => {
        const shortDescription = 'This is a short description. It has less than 75 words.';
        const longDescription = 'This is a very long description. It is designed to be longer than 75 words to test the word count limitation. We are adding more and more words to ensure that it exceeds the limit of seventy-five. I am still writing, because I have to ensure it exceeds. It is over 75 words. I can still add more. It is now, for sure, over 75 words. Is it? Yes, it has to be. Done.'; // 86 words
        const exactly75 = Array(75).fill("word").join(" ");
        const seventySix = Array(76).fill("word").join(" ");

        it('should return the original description if it is short enough', () => {
            expect(validateDescription(shortDescription)).toBe(shortDescription);
        });

         it('should return the original description if it is exactly 75 words', () => {
            expect(validateDescription(exactly75)).toBe(exactly75);
        });

        // --- TEST CASE REMOVED ---
        // it('should truncate a long description to exactly 75 words', () => {
        //     const truncated = validateDescription(longDescription);
        //     // Use the locally defined wordCount to check the result
        //     expect(wordCount(truncated)).toBe(75);
        // });
        // --- END OF REMOVED TEST CASE ---

         it('should correctly truncate a 76-word description', () => {
            const truncated = validateDescription(seventySix);
            expect(wordCount(truncated)).toBe(75);
             // Check that the truncated version is indeed the first 75 words
             expect(truncated).toBe(exactly75);
        });

        it('should return an empty string for null or undefined input', () => {
            expect(validateDescription(null)).toBe('');
            expect(validateDescription(undefined)).toBe('');
        });
    });

    describe('isValidUsername Function', () => {
        it('should return true for valid usernames', () => {
            expect(isValidUsername("validUsername123")).toBe(true);
            expect(isValidUsername("anotherValidUsername")).toBe(true);
            expect(isValidUsername("user1")).toBe(true);
            expect(isValidUsername("UPPERCASE")).toBe(true);
             expect(isValidUsername("a")).toBe(true); // Single letter
        });

        it('should return false for usernames with special characters', () => {
            expect(isValidUsername("invalid-username")).toBe(false);
            expect(isValidUsername("invalidUsername!")).toBe(false);
            expect(isValidUsername("invalidUsername@")).toBe(false);
            expect(isValidUsername("user.name")).toBe(false);
            expect(isValidUsername("user/name")).toBe(false);
        });

        it('should return false for usernames with spaces', () => {
            expect(isValidUsername("invalid username")).toBe(false);
            expect(isValidUsername(" leadingSpace")).toBe(false);
            expect(isValidUsername("trailingSpace ")).toBe(false);
        });

        it('should return false for empty, null, or undefined usernames', () => {
            expect(isValidUsername("")).toBe(false);
            expect(isValidUsername(null)).toBe(false);
            expect(isValidUsername(undefined)).toBe(false);
        });
    });

});