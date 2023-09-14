import { render, screen } from '@testing-library/react';
import Marbles from './Marbles';

test('renders hello world link', () => {
  render(<Marbles />);
  const linkElement = screen.getByText(/hello world/i);
  expect(linkElement).toBeInTheDocument();
});
