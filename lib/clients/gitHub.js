const axios = require('axios');

const getRepositoriesByLanguage = async (languages, perPage) => {
  try {
    const lastIndex = languages.length - 1;
    let language = '';
    languages.forEach((item, i) => {
      language += lastIndex !== i ? `language:${item}+` : `language:${item}`;
    });
    const path = '/search/repositories';
    const query = `?q=${language}&sort=stargazers_count&order=desc&per_page=${perPage}`;
    const url = `${process.env.GITHUB_URL}${path}${query}`;
    const response = await axios.get(url);
    return { data: response.data.items };
  } catch (error) {
    return { error };
  }
};

module.exports = getRepositoriesByLanguage;
