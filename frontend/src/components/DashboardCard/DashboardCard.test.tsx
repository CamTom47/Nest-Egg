import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardCard from './DashboardCard';

it('renders', () => {
  render(<DashboardCard/>)
});
it('renders without crashing', () => {
  const {asFragment} = render(<DashboardCard/>)

  expect(asFragment).toMatchSnapshot(<DashboardCard/>)
});
