import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardSummary from './DashboardSummary';

it('renders', () => {
  render(<DashboardSummary/>)
});
it('renders without crashing', () => {
  const {asFragment} = render(<DashboardSummary/>)

  expect(asFragment).toMatchSnapshot(<DashboardSummary/>)
});
