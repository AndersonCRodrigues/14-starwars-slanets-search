import React, { useState, useEffect, useCallback } from 'react';
import { fetchApi } from '../services';
import '../styles/Home.css';
import { MENOS_1, formulario, inputSelect01, operador } from '../constant';
import Select from './Select';

export default function Home() {
  const [planets, setPlanets] = useState([]);
  const [busca, setBusca] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(formulario);
  const [array, setArray] = useState(inputSelect01);
  const [filtro, setFiltro] = useState([]);

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
    return (
      <h1>Loading...</h1>
    );
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

  const addFiltro = (e) => {
    e.preventDefault();
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
          type="button"
          data-testid="button-filter"
          onClick={ addFiltro }
        >
          Filtrar
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
                type="button"
                onClick={ () => revomeFiltro(index) }
              >
                X
              </button>
            </span>
          </div>))}
      </section>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rotation Period</th>
            <th>Orbital Period</th>
            <th>Diamenter</th>
            <th>Climate</th>
            <th>Gravity</th>
            <th>Terrain</th>
            <th>Surface Water</th>
            <th>Population</th>
            <th>Films</th>
            <th>Created</th>
            <th>Edited</th>
            <th>Url</th>
          </tr>
        </thead>
        <tbody>
          {busca.map((planet, index) => (
            <tr key={ index + planet.name }>
              <td>{planet.name}</td>
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
