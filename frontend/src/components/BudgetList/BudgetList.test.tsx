import React from 'react';
import { render, screen } from '@testing-library/react';
import BudgetList from './BudgetList';

it('renders', () => {
  render(<BudgetList/>)
});
it('renders without crashing', () => {
  const {asFragment} = render(<BudgetList/>)

  expect(asFragment).toMatchSnapshot(<BudgetList/>)
});
