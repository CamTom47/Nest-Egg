import React from 'react';
import { render, screen } from '@testing-library/react';
import CategoryList from './CategoryList';

it('renders', () => {
  render(<CategoryList/>)
});
it('renders without crashing', () => {
  const {asFragment} = render(<CategoryList/>)

  expect(asFragment).toMatchSnapshot(<CategoryList/>)
});
