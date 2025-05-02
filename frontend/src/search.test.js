/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve(__dirname, './Search.html'), 'utf8');

describe('Search Page Functionality', () => {
    let container;

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        container = document.body;

        // Mock localStorage
        global.localStorage = {
            store: {},
            getItem(key) {
                return this.store[key] || null;
            },
            setItem(key, value) {
                this.store[key] = value;
            },
            clear() {
                this.store = {};
            }
        };

        // Re-evaluate script after setting DOM
        const scriptTag = container.querySelector('script');
        eval(scriptTag.textContent);
    });

    test('Search form filters by subject and name', () => {
        const form = container.querySelector('#search-form');
        const input = form.querySelector('input[name="search"]');
        const select = form.querySelector('select[name="subject"]');

        input.value = 'alice';
        select.value = 'Math';

        form.dispatchEvent(new Event('submit'));

        const results = container.querySelector('#search-results').innerHTML;
        expect(results).toContain('Alice Johnson');
        expect(results).toContain('Math');
    });

    test('Selecting a tutor adds to localStorage if not already added', () => {
        const tutor = {
            name: "Test Tutor",
            subject: "Math",
            rating: 4.5
        };
        const encoded = encodeURIComponent(JSON.stringify(tutor));

        selectTutor(encoded);

        const saved = JSON.parse(localStorage.getItem('selectedTutors'));
        expect(saved.length).toBe(1);
        expect(saved[0].name).toBe('Test Tutor');
    });

    test('Selecting a duplicate tutor does not add again', () => {
        const tutor = {
            name: "Test Tutor",
            subject: "Math",
            rating: 4.5
        };
        const encoded = encodeURIComponent(JSON.stringify(tutor));

        selectTutor(encoded);
        selectTutor(encoded);

        const saved = JSON.parse(localStorage.getItem('selectedTutors'));
        expect(saved.length).toBe(1); // Should still only be one
    });

    test('Search results display message when no match', () => {
        const form = container.querySelector('#search-form');
        const input = form.querySelector('input[name="search"]');
        input.value = 'zzzzzzz'; // unlikely match

        form.dispatchEvent(new Event('submit'));

        const results = container.querySelector('#search-results').innerHTML;
        expect(results).toContain('No tutors found');
    });
});