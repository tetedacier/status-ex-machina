import React from 'react';
import {
    render,
    screen
} from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
    render(<App />);
    expect(
        screen.getByText(/Machine description/)
    ).toBeInTheDocument();
    expect(
        screen.getByText(/Machine states/)
    ).toBeInTheDocument();
});
