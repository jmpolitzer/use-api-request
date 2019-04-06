import { useReducer, useCallback } from "react";

import { handleFetching, handleSuccess, handleError } from "./actions";
import buildReducer from "./reducer";

function useApiRequest({ axios, debug }) {
  const initialState = {
    fetching: [],
    resources: {},
    errors: {}
  };

  const key = Math.random()
    .toString(36)
    .substr(2, 5);
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
    dispatch(handleError(resource, { [resource]: error }));
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
          dispatch(handleSuccess(resource, { [resource]: response }));
        }
      })
      .catch(e => onError(resource, e));
  };

  const makeApiRequests = config => {
    const resources = Object.keys(config);
    const joinedResources = resources.join("-");

    dispatch(handleFetching(joinedResources));

    Promise.all(resources.map(key => axios.request(config[key])))
      .then(responses => {
        const response = resources.reduce((acc, resource, i) => {
          acc[resource] = responses[i];

          return acc;
        }, {});

        dispatch(handleSuccess(joinedResources, response));
      })
      .catch(e => onError(joinedResources, e));
  };

  return { state, makeApiRequest, makeApiRequests };
}

export default useApiRequest;
