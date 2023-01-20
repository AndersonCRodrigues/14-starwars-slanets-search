export const fetchApi = async () => {
  const URL = 'https://swapi.dev/api/planets';
  const response = await fetch(URL);
  const data = await response.json();
  data.results.forEach((planet) => {
    delete planet.residents;
  });
  return data.results;
};
