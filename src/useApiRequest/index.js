import { useReducer, useCallback } from "react";

import { handleFetching, handleSuccess, handleError } from "./actions";
import buildReducer from "./reducer";

function useApiRequest({ axios, key, debug }) {
  const initialState = {
    fetching: [],
    resources: {},
    errors: {}
  };

  const reducer = useCallback(buildReducer(debug), [key]);
  const [state, dispatch] = useReducer(reducer, initialState);

  const replaceParams = (url, response) => {
    const matches = url.match(/\{{.*?\}}/g);

    if (matches && matches.length > 0) {
      const params = matches.map(match =>
        match.replace("{{", "").replace("}}", "")
      );

      return matches.reduce((acc, match, i) => {
        const param = params[i].split(".").reduce((pAcc, fragment, j) => {
          return pAcc[fragment];
        }, response);

        return acc.replace(match, param);
      }, url);
    } else {
      return url;
    }
  };

  const onError = (resource, error) => {
    dispatch(handleError(resource, error));
  };

  const makeApiRequest = (config, prevResponse) => {
    const resource = Object.keys(config)[0];
    const { next, isNext, url, ...rest } = config[resource];
    const request = { ...rest, url: replaceParams(url, prevResponse) };

    if (!isNext) dispatch(handleFetching(resource));

    axios
      .request(request)
      .then(response => {
        if (next) {
          const nextConfig = { [resource]: { ...next, isNext: true } };

          makeApiRequest(nextConfig, response);
        } else {
          dispatch(handleSuccess([resource], { [resource]: response }));
        }
      })
      .catch(e => onError(resource, { [resource]: e }));
  };

  const makeApiRequests = config => {
    const resources = Object.keys(config);

    dispatch(handleFetching(resources));

    Promise.all(
      resources.map(key =>
        axios.request({
          ...config[key],
          headers: {
            resourceKey: key
          }
        })
      )
    )
      .then(responses => {
        const response = resources.reduce((acc, resource, i) => {
          acc[resource] = responses[i];

          return acc;
        }, {});

        dispatch(handleSuccess(resources, response));
      })
      .catch(e => {
        const resource = e.config.headers.resourceKey;

        return onError(resources, { [resource]: e });
      });
  };

  return { state, makeApiRequest, makeApiRequests };
}

export default useApiRequest;
