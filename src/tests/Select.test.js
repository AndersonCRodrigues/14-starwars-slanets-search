import { render, screen } from "@testing-library/react"
import Select from "../components/Select"
import { operador } from "../constant"
import userEvent from "@testing-library/user-event"



describe('<Select/>', () => {
  test('se Select renderiza na tela', () => {
    const func = jest.fn(() => {})
    render(<Select name={test} value={test} func={func} testId='test-id' arr={operador}/>)

    const select = screen.getByTestId('test-id');
    expect(select).toBeInTheDocument();

    userEvent.click(select);

    const maior = screen.getByText(/maior/i);
    const menor = screen.getByText(/menor/i);
    const igual = screen.getByText(/igual/i);

    expect(maior).toBeInTheDocument();
    expect(menor).toBeInTheDocument();
    expect(igual).toBeInTheDocument();

  })
})