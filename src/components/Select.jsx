import React from 'react';
import P from 'prop-types';

export default function Select({ name, value, func, testId, arr }) {
  return (
    <select
      name={ name }
      id={ name }
      value={ value }
      onChange={ func }
      data-testid={ testId }
    >
      {arr.map((item) => (
        <option
          key={ item }
          value={ item }
        >
          {item}
        </option>))}
    </select>
  );
}

Select.propTypes = {
  name: P.string,
  value: P.string,
  func: P.func,
  testId: P.string,
  arr: P.arrayOf(P.string),
}.isRequired;
