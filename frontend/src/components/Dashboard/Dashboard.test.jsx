import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

it('renders', () => {
  render(<Dashboard/>)
});
it('renders without crashing', () => {
  const {asFragment} = render(<Dashboard/>)

  expect(asFragment).toMatchSnapshot(<Dashboard/>)
});
