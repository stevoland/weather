import 'isomorphic-fetch';

import fetch from '../fetch';

const makeResponse = (status, body) => ({
  status,
  json() {
    return body;
  }
});

describe('fetch', () => {
  it('makes fetch request', () => {
    spyOn(global, 'fetch').and.returnValue(
      Promise.resolve(
        makeResponse(200, {})
      )
    );

    fetch('/path');
    expect(global.fetch).toHaveBeenCalledWith('/path');
  });

  it('returns resolving promise on success', () => {
    spyOn(global, 'fetch').and.returnValue(
      Promise.resolve(
        makeResponse(200, {})
      )
    );

    return fetch('/path')
      .then(response => {
        expect(response).toEqual({});
      })
      .catch(err => {
        console.info(err);
      });
  });

  it('returns rejecting promise on 401', (done) => {
    const body = {
      message: 'Invalid API key'
    };

    spyOn(global, 'fetch').and.returnValue(
      Promise.resolve(
        makeResponse(401, body)
      )
    );

    return fetch('/path')
      .catch(response => {
        expect(response).toEqual(body);
        done();
      });
  });
});
