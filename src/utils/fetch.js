import 'isomorphic-fetch';

const processStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response.json());
  }
  return Promise.reject(response.json());
};

const fetch = (...args) => {
  return global.fetch.apply(null, args)
    .then(processStatus);
};

export default fetch;
