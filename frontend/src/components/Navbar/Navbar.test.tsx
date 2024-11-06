import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';

it('renders', () => {
  render(<Navbar/>)
});
it('renders without crashing', () => {
  const {asFragment} = render(<Navbar/>)

  expect(asFragment).toMatchSnapshot(<Navbar/>)
});
