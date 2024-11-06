import React from 'react';
import { render, screen } from '@testing-library/react';
import Homepage from './Homepage';

it('renders', () => {
  render(<Homepage/>)
});
it('renders without crashing', () => {
  const {asFragment} = render(<Homepage/>)

  expect(asFragment).toMatchSnapshot(<Homepage/>)
});
