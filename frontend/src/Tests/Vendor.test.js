import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Vendor from '../components/Vendor'; // adjust the path as needed
import axios from 'axios';

// Mocking the Axios get method
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({
    data: {
      '1': { productName: 'Coke', cost: 50, amountAvailable: 5 },
      '2': { productName: 'Pepsi', cost: 40, amountAvailable: 10 },
    },
  })),
}));

describe('Vendor component', () => {
  const deposit = 100;
  const buyerID = 1;

  beforeEach(() => {
    localStorage.setItem('token', 'fake_token'); // If the token is required
    render(<Vendor deposit={deposit} buyerID={buyerID} />);
  });

  it('renders without crashing', () => {
    expect(screen.getByText('Vending Machine')).toBeInTheDocument();
  });

  it('displays the correct deposit', () => {
    expect(screen.getByText(`Deposit: ${deposit} cents`)).toBeInTheDocument();
  });

  it('renders the select options for coin', () => {
    expect(screen.getByText('5 cents')).toBeInTheDocument();
    expect(screen.getByText('10 cents')).toBeInTheDocument();
    expect(screen.getByText('20 cents')).toBeInTheDocument();
    expect(screen.getByText('50 cents')).toBeInTheDocument();
    expect(screen.getByText('100 cents')).toBeInTheDocument();
  });

  it('should have correct buttons', () => {
    expect(screen.getByText('Deposit')).toBeInTheDocument();
    expect(screen.getByText('Reset deposit')).toBeInTheDocument();
  });

  it('should display products', async () => {
    expect(await screen.findByText('Coke')).toBeInTheDocument();
    expect(await screen.findByText('Pepsi')).toBeInTheDocument();
  });
});
