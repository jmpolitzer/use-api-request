import logger from "./helpers/logger";

function createReducer() {
  return function(state, action) {
    const { resource } = action.payload;

    switch (action.type) {
      case `${resource}/FETCHING`:
        return {
          ...state,
          fetching: [...state.fetching, action.payload.resource]
        };
      case `${resource}/SUCCESS`:
        return {
          fetching: state.fetching.filter(
            resource => resource !== action.payload.resource
          ),
          resources: {
            ...state.resources,
            ...action.payload.response
          },
          errors: {
            ...state.errors,
            ...(state.errors[action.payload.resource] && {
              [action.payload.resource]: null
            })
          }
        };
      case `${resource}/ERROR`:
        return {
          ...state,
          fetching: state.fetching.filter(
            resource => resource !== action.payload.resource
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
