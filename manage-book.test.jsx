import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import ManageBook from './ManageBook';

// Mock axios post method
jest.mock('axios', () => ({
    post: jest.fn(),
}));

describe('ManageBook', () => {
    beforeEach(() => {
        render(<ManageBook />);
    });

    it('renders book details', async () => {
        // Mock the book data
        const book = {
            image: 'https://upload.wikimedia.org/wikipedia/en/3/39/The_Hunger_Games_cover.jpg',
            title: 'The Hunger Games',
            author: 'Suzanne Collins',
            genre: 'Fiction',
            description: 'Book Description',
        };

        // Mock axios get method
        axios.get.mockResolvedValueOnce({ data: book });

        // Wait for book details to be rendered
        const bookTitle = await screen.findByText('The Hunger Games');
        const bookAuthor = screen.getByText('Author: Suzanne Collins');
        const bookGenre = screen.getByText('Genre: Fiction');
        const bookDescription = screen.getByText('Book Description');

        // Assertions
        expect(bookTitle).toBeInTheDocument();
        expect(bookAuthor).toBeInTheDocument();
        expect(bookGenre).toBeInTheDocument();
        expect(bookDescription).toBeInTheDocument();
    });

    it('saves sub-book data', async () => {
        // Mock the sub-book data
        const subBook = {
            book_id: '1',
            title: 'The Hunger Games',
            detail: 'Sub-Book Detail',
            question: 'Sub-Book Question',
        };

        // Mock axios post method
        axios.post.mockResolvedValueOnce({ data: subBook });

        // Fill in the form fields
        const titleInput = screen.getByLabelText('Title:');
        const questionInput = screen.getByLabelText('Question:');
        const descriptionInput = screen.getByLabelText('Description:');
        fireEvent.change(titleInput, { target: { value: 'Sub-Book Title' } });
        fireEvent.change(questionInput, { target: { value: 'Sub-Book Question' } });
        fireEvent.change(descriptionInput, { target: { value: 'Sub-Book Description' } });

        // Click the "Add Materials" button
        const addButton = screen.getByText('Add Materials');
        fireEvent.click(addButton);

        // Wait for the data to be saved
        const successMessage = await screen.findByText('Data saved');

        // Assertions
        expect(axios.post).toHaveBeenCalledWith(
            'api-url/sub_book',
            expect.objectContaining({
                book_id: 'book-id',
                title: 'Sub-Book Title',
                detail: 'Sub-Book Description',
                question: 'Sub-Book Question',
            })
        );
        expect(successMessage).toBeInTheDocument();
    });
});
