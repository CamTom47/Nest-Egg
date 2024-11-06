import React from 'react';
import { render, screen } from '@testing-library/react';
import SubcategoryList from './SubcategoryList';

it('renders', () => {
  render(<SubcategoryList/>)
});
it('renders without crashing', () => {
  const {asFragment} = render(<SubcategoryList/>)

  expect(asFragment).toMatchSnapshot(<SubcategoryList/>)
});
