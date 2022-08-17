const fecth = require('node-fetch');
const fs = require('fs');

const initURI = 'https://rickandmortyapi.com/api/character'
const pageURI = 'https://rickandmortyapi.com/api/character?page='

async function getDataFormatted() {
  const pagesURIs = [];
  for(let i = 2; i < 43; i++) {
    pagesURIs.push(pageURI + i);
  }
  const data = await Promise.allSettled([fecth(initURI), ...pagesURIs.map((url) => fecth(url))]);
  const jsonData = await Promise.allSettled(data.map((d) => d.value.json()));
  const valuesFetched = jsonData.map((response) => response.value.results);
  const joinValues = valuesFetched.reduce((acc, curr) => acc.concat(curr), []);
  const changingEpisodes = joinValues.map((value) => ({
    ...value,
    episode: value.episode.length
  }));
  return changingEpisodes;  
}

async function createJsonFile() {
  const data = await getDataFormatted();
  const jsonData = JSON.stringify(data);
  fs.writeFileSync('rickandmortydata.json', jsonData);
}

createJsonFile();