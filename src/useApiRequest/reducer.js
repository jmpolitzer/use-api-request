import logger from "./helpers/logger";

const filterFetching = (action, state) =>
  state.fetching.filter(
    resource => !action.payload.resource.includes(resource)
  );

const filterResourcesOrErrors = (resource, resources) => {
  const r = Object.keys(resources).reduce((acc, res) => {
    if (!resource.includes(res)) {
      acc[res] = resources[res];
    }

    return acc;
  }, {});

  return r;
};

function createReducer() {
  return function(state = {}, action) {
    const { resource } = action.payload;

    switch (action.type) {
      case `${resource}/FETCHING`:
        return {
          fetching: [...state.fetching, action.payload.resource].reduce((acc, val) => acc.concat(val), []),
          resources: filterResourcesOrErrors(
            action.payload.resource,
            state.resources
          ),
          errors: filterResourcesOrErrors(action.payload.resource, state.errors)
        };
      case `${resource}/SUCCESS`:
        return {
          fetching: filterFetching(action, state),
          resources: {
            ...state.resources,
            ...action.payload.response
          },
          errors: filterResourcesOrErrors(action.payload.resource, state.errors)
        };
      case `${resource}/ERROR`:
        return {
          fetching: filterFetching(action, state),
          resources: filterResourcesOrErrors(
            action.payload.resource,
            state.resources
          ),
          errors: {
            ...state.errors,
            ...action.payload.error
          }
        };
    }
  };
}

function buildReducer(debug) {
  const reducer = createReducer();

  /* istanbul ignore next */
  if (debug === true && process.env.NODE_ENV === "development") {
    return logger(reducer);
  } else {
    return reducer;
  }
}

export default buildReducer;
