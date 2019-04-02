export function handleFetching(resource) {
  return {
    type: `${resource}/FETCHING`,
    payload: {
      resource
    }
  };
}

export function handleSuccess(resource, response) {
  return {
    type: `${resource}/SUCCESS`,
    payload: {
      resource,
      response
    }
  };
}

export function handleError(resource, error) {
  return {
    type: `${resource}/ERROR`,
    payload: {
      resource,
      error
    }
  };
}
