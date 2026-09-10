import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza o título da página inicial', () => {
  render(<App />);
  const titleElement = screen.getByText(/Postagens/i);
  expect(titleElement).toBeInTheDocument();
});
