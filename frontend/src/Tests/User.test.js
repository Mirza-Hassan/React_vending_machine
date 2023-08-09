import React from 'react';
import { render, screen } from '@testing-library/react';
import User from '../components/User';
import axios from 'axios';

// Mocking the Axios get method
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({
    data: {
      'john_doe': {
        role: 'buyer',
        deposit: 100,
        buyerID: '123',
      },
    },
  })),
  put: jest.fn(() => Promise.resolve({})),
  delete: jest.fn(() => Promise.resolve({})),
}));

describe('<User />', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake_token');
  });

  it('renders the component without error', () => {
    const username = 'john_doe';
    const userDetail = {
      role: 'buyer',
      deposit: 100,
      buyerID: '123',
    };

    render(<User username={username} userDetail={userDetail} />);
    
    // Check if the username is rendered
    expect(screen.getByText(`${username}`)).toBeInTheDocument();

    // Check if the role is rendered
    expect(screen.getByText(`${userDetail.role}`)).toBeInTheDocument();

    // Check if the deposit is rendered
    expect(screen.getByText(`${userDetail.deposit}`)).toBeInTheDocument();
  });
});
