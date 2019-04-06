import logger from "./helpers/logger";

const filterFetching = (action, state) => state.fetching.filter(
  resource => resource !== action.payload.resource
);

const filterErrors = (action, state) => {
  const e = Object.keys(state.errors).reduce((acc, error) => {
    if (error !== action.payload.resource) {
      acc[error] = state.errors[error];
    }

    return acc;
  }, {});

  return e;
};

function createReducer() {
  return function(state, action) {
    const { resource } = action.payload;

    switch (action.type) {
      case `${resource}/FETCHING`:
        return {
          ...state,
          fetching: [...state.fetching, action.payload.resource],
          errors: filterErrors(action, state)
        };
      case `${resource}/SUCCESS`:
        return {
          fetching: filterFetching(action, state),
          resources: {
            ...state.resources,
            ...action.payload.response
          },
          errors: filterErrors(action, state)
        };
      case `${resource}/ERROR`:
        return {
          ...state,
          fetching: filterFetching(action, state),
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
