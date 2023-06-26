import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Login from './Login';

// Mock axios post method
jest.mock('axios', () => ({
    post: jest.fn(),
}));

describe('Login', () => {
    beforeEach(() => {
        render(<Login />);
    });

    it('renders login form', () => {
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        const loginButton = screen.getByText('Login');
        const signupButton = screen.getByText('Sign up now');

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(loginButton).toBeInTheDocument();
        expect(signupButton).toBeInTheDocument();
    });

    it('logs in successfully', async () => {
        // Mock the login response data
        const loginData = {
            email: 'guntur@gmail.com',
            idUser: '30',
        };

        // Mock axios post method
        axios.post.mockResolvedValueOnce({ data: loginData });

        // Fill in the form fields
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        fireEvent.change(emailInput, { target: { value: 'guntur@gmail.com' } });
        fireEvent.change(passwordInput, { target: { value: 'guntur' } });

        // Click the "Login" button
        const loginButton = screen.getByText('Login');
        fireEvent.click(loginButton);

        // Wait for the user to be redirected to the profile page
        const profilePage = await screen.findByText('Profile Page');

        // Assertions
        expect(axios.post).toHaveBeenCalledWith(
            'api-url/login',
            expect.objectContaining({
                email: 'guntur@gmail.com',
                password: 'guntur',
            })
        );
        expect(profilePage).toBeInTheDocument();
        expect(localStorage.getItem('email')).toBe('guntur@gmail.com');
        expect(localStorage.getItem('idUser')).toBe('30');
    });

    it('displays error message on failed login', async () => {
        // Mock axios post method to simulate failed login
        axios.post.mockRejectedValueOnce(new Error('Login failed'));

        // Fill in the form fields
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');
        fireEvent.change(emailInput, { target: { value: 'guntur@gmail.com' } });
        fireEvent.change(passwordInput, { target: { value: 'guntur' } });

        // Click the "Login" button
        const loginButton = screen.getByText('Login');
        fireEvent.click(loginButton);

        // Wait for the error message to be displayed
        const errorMessage = await screen.findByText('Email or password is wrong');

        // Assertions
        expect(axios.post).toHaveBeenCalledWith(
            'api-url/login',
            expect.objectContaining({
                email: 'guntur@gmail.com',
                password: 'guntur',
            })
        );
        expect(errorMessage).toBeInTheDocument();
    });
});
