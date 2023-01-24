import React, { useState, useEffect, useCallback } from 'react';
import { fetchApi } from './services';
import './styles/Home.css';
import { MENOS_1, formulario, inputSelect01, operador, ordenar } from './constant';
import Select from './components/Select';
import TableHead from './components/TableHead';

export default function App() {
  const [planets, setPlanets] = useState([]);
  const [busca, setBusca] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(formulario);
  const [array, setArray] = useState(inputSelect01);
  const [filtro, setFiltro] = useState([]);
  const [orderBusca, setOrderBusca] = useState(ordenar);

  /*   const ordenaFiltro = () => {
    setBusca((s) => s.sort((a, b) => (sort === 'ASC'
      ? a[column] - b[column] : b[column] - a[column])));
  };

  useEffect(() => {
    ordenaFiltro();
  }, [counter, ordenaFiltro]); */

  const loadPlanets = useCallback(async () => {
    const data = await fetchApi();
    setPlanets(data);
    setBusca(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPlanets();
  }, [loadPlanets]);

  if (loading) {
    return (<h1>Loading...</h1>);
  }

  const filtrar = (atualiza) => {
    if (atualiza.length < 1) setBusca(planets);
    atualiza.forEach((f) => {
      switch (f.operador) {
      case 'maior que':
        setBusca((b) => b.filter((planet) => +planet[f.coluna] > +f.quantidade));
        break;
      case 'menor que':
        setBusca((b) => b.filter((planet) => +planet[f.coluna] < +f.quantidade));
        break;
      case 'igual a':
        setBusca((b) => b.filter((planet) => +planet[f.coluna] === +f.quantidade));
        break;
      default:
        return null;
      }
    });
  };

  const nameFilter = ({ target }) => {
    const { value } = target;
    setBusca(planets.filter((planet) => planet
      .name.toLowerCase().includes(value)));
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setForm({ ...form, [name]: value });
  };

  const atualizaState = () => {
    const index = array.indexOf(form.coluna);
    if (index > MENOS_1) {
      array.splice(index, 1);
      setArray(array);
      setForm({ ...form, coluna: array[0] });
    }
  };

  const addFiltro = () => {
    const obj = {
      coluna: form.coluna,
      operador: form.operador,
      quantidade: form.quantidade,
    };

    filtro.push(obj);

    filtrar(filtro);
    atualizaState();

    setFiltro(filtro);
  };

  const revomeFiltro = (index) => {
    const newFiltro = filtro.splice(index, 1);
    setArray([...array, newFiltro[0].coluna]);
    setBusca(planets);
    filtrar(filtro);
    setFiltro(filtro);
  };

  const removeAll = () => {
    const item = [];
    filtro.forEach(({ coluna }) => item.push(coluna));
    setArray([...array, ...item]);
    setFiltro([]);
    filtrar([]);
  };

  const handleOrder = ({ target }) => {
    const { name, value } = target;
    setOrderBusca({ ...orderBusca, order: { ...orderBusca.order, [name]: value } });
  };

  return (
    <section>
      <label htmlFor="input">
        Filtro
        <input
          type="text"
          name="input"
          id="input"
          data-testid="name-filter"
          onChange={ nameFilter }
        />
      </label>
      <section>
        Coluna
        <Select
          name="coluna"
          value={ form.coluna }
          func={ handleChange }
          testId="column-filter"
          arr={ array }
        />
        Operador
        <Select
          name="operador"
          value={ form.operador }
          func={ handleChange }
          testId="comparison-filter"
          arr={ operador }
        />
        Quantidade
        <input
          type="number"
          name="quantidade"
          id="quantidade"
          value={ form.quantidade }
          onChange={ handleChange }
          data-testid="value-filter"
        />
        <button
          data-testid="button-filter"
          onClick={ addFiltro }
        >
          Filtrar
        </button>
        Ordenar
        <Select
          name="column"
          value={ orderBusca.order.column }
          func={ handleOrder }
          testId="column-sort"
          arr={ inputSelect01 }
        />
        <label htmlFor="ASC">
          <input
            type="radio"
            name="sort"
            value="ASC"
            id="ASC"
            onChange={ handleOrder }
            data-testid="column-sort-input-asc"
            checked={ orderBusca.order.sort === 'ASC' }
          />
          Ascendente
        </label>
        <label htmlFor="DESC">
          <input
            type="radio"
            name="sort"
            value="DESC"
            id="DESC"
            onChange={ handleOrder }
            data-testid="column-sort-input-desc"
            checked={ orderBusca.order.sort === 'DESC' }
          />
          Decrescente
        </label>
        <button
          data-testid="column-sort-button"
        >
          Ordenar

        </button>
        <button
          data-testid="button-remove-filters"
          onClick={ removeAll }
        >
          Remover Filtros
        </button>
      </section>
      <section>
        {filtro && filtro.map((o, index) => (
          <div
            key={ o.coluna + index }
            data-testid="filter"
          >
            <span>
              {`${o.coluna} ${o.operador} ${o.quantidade}`}
              {' '}
              <button
                onClick={ () => revomeFiltro(index) }
              >
                X
              </button>
            </span>
          </div>))}
      </section>
      <table>
        <TableHead />
        <tbody>
          {busca.map((planet, index) => (
            <tr key={ index + planet.name }>
              <td data-testid="planet-name">{planet.name}</td>
              <td>{planet.rotation_period}</td>
              <td>{planet.orbital_period}</td>
              <td>{planet.diameter}</td>
              <td>{planet.climate}</td>
              <td>{planet.gravity}</td>
              <td>{planet.terrain}</td>
              <td>{planet.surface_water}</td>
              <td>{planet.population}</td>
              <td>{planet.films}</td>
              <td>{planet.created}</td>
              <td>{planet.edited}</td>
              <td>{planet.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
