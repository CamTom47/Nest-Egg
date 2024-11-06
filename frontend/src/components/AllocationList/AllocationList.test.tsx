import React from 'react';
import { render, screen } from '@testing-library/react';
import AllocationList from './AlloctionList';

it('renders', () => {
  render(<AllocationList/>)
});
it('renders without crashing', () => {
  const {asFragment} = render(<AllocationList/>)

  expect(asFragment).toMatchSnapshot(<AllocationList/>)
});
