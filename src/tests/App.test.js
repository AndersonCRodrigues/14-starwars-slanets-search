import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { data } from '../constant';
import { wait } from '@testing-library/user-event/dist/utils';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('<App/>', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(data) ,
    }));
    render(<App />);
  });

  test('testa se loading aparece quando carrega a tela', () => {

    const loading = screen.getByRole('heading', {name: /loading/i, level: 1});

    expect(loading).toBeInTheDocument();
  });

  test('elementos na tela', async () => {

    await waitFor(() => {

      const name = screen.getByTestId('name-filter');
      const column = screen.getByTestId('column-filter');
      const operator = screen.getByTestId('comparison-filter');
      const number = screen.getByTestId('value-filter');
      const applyFilter = screen.getByRole('button', { name: /filtrar/i });
      const clearFilters = screen.getByRole('button', { name: /remover filtros/i });
      const sortSelect = screen.getByTestId('column-sort');
      const ascendente = screen.getByTestId('column-sort-input-asc');
      const decrescente = screen.getByTestId('column-sort-input-desc');
      const applyOrder = screen.getByTestId('column-sort-button');

      expect(name).toBeInTheDocument();
      expect(column).toBeInTheDocument();
      expect(operator).toBeInTheDocument();
      expect(number).toBeInTheDocument();
      expect(applyFilter).toBeInTheDocument();
      expect(sortSelect).toBeInTheDocument();
      expect(ascendente).toBeInTheDocument();
      expect(decrescente).toBeInTheDocument();
      expect(applyOrder).toBeInTheDocument();
    });
  });

  test('filtro de texto', async () => {

    await waitFor(() => {
      const nameFilter = screen.getByTestId('name-filter');
      expect(nameFilter).toBeInTheDocument();

      const planest = screen.getAllByTestId('planet-name');
      expect(planest).toHaveLength(10);

      userEvent.type(nameFilter, 'ta');
      const tatooine = screen.getByText(/tatooine/i);
      const alderaan = screen.queryByText(/alderaan/i);

      expect(tatooine).toBeInTheDocument();
      expect(alderaan).not.toBeInTheDocument();
    });
  });

  test('multiplos filtros', async () => {
    await waitFor(() => {
      const column = screen.getByTestId('column-filter');
      const operator = screen.getByTestId('comparison-filter');
      const number = screen.getByTestId('value-filter');
      const applyFilter = screen.getByRole('button', { name: /filtrar/i });

      userEvent.selectOptions(column, 'population');
      userEvent.selectOptions(operator, 'igual a');
      userEvent.clear(number);
      userEvent.type(number, '2000000000')
      userEvent.click(applyFilter)
      const deleteFilter = screen.getByRole('button', {  name: /x/i})

      const alderaan = screen.getByText(/alderaan/i);
      const tatooine = screen.queryByText(/tatooine/i);

      expect(alderaan).toBeInTheDocument();
      expect(tatooine).not.toBeInTheDocument();
      userEvent.click(deleteFilter);
    });
  });
});
