import { render, screen } from "@testing-library/react"
import TableHead from "../components/TableHead"

describe('<TableHead />', () => {
  test('se renderiza TableHead', () => {
    render(<TableHead/>);

    const colunms = screen.getAllByRole('columnheader');
    const primeiraCol = screen.getByRole('columnheader', {  name: /name/i});
    const segundaCol = screen.getByRole('columnheader', {  name: /rotation period/i});

    expect(colunms).toHaveLength(13);
    expect(primeiraCol).toBeInTheDocument();
    expect(segundaCol).toBeInTheDocument();
  })
})