import React from 'react';
import { render, screen } from '@testing-library/react';
import Budget from './Budget';

it('renders', () => {
  render(<Budget/>)
});
it('renders without crashing', () => {
  const {asFragment} = render(<Budget/>)

  expect(asFragment).toMatchSnapshot(<Budget/>)
});
