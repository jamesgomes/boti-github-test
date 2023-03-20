const axios = require('axios');

const getRepositoriesByLanguages = async (languages, page) => {
  try {
    const nextPage = page + 1;
    const lastIndex = languages.length - 1;
    let language = '';
    languages.forEach((item, i) => {
      language += lastIndex !== i ? `language:${item}+` : `language:${item}`;
    });
    const path = '/search/repositories';
    const query = `?q=${language}&sort=stargazers_count&order=desc&per_page=100&page=${page}`;
    const url = `${process.env.GITHUB_URL}${path}${query}`;
    const response = await axios.get(url);
    return {
      data: {
        items: response?.data?.items,
        nextPage: response?.data?.incomplete_results === true ? nextPage : -1,
      },
    };
  } catch (error) {
    return { error };
  }
};

module.exports = getRepositoriesByLanguages;
