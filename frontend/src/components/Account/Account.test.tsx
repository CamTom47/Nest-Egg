import React from 'react';
import { render, screen } from '@testing-library/react';
import Account from './Account';

it('renders', () => {
  render(<Account/>)
});
it('renders without crashing', () => {
  const {asFragment} = render(<Account/>)

  expect(asFragment).toMatchSnapshot(<Account/>)
});
