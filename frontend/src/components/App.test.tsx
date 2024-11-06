import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

it('renders', () => {
  render(<App/>)
});
it('renders without crashing', () => {
  const {asFragment} = render(<App/>)

  expect(asFragment).toMatchSnapshot(<App/>)
});
