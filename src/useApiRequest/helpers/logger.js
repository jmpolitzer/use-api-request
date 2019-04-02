function logger(reducer) {
  return function(state, action) {
    console.info(
      "%c Previous State:",
      "font-weight: bold; color: #2471A3;",
      state
    );
    console.info(
      "%c Action",
      "font-weight: bold; color: #CB4335;",
      action.type
    );

    const nextState = reducer(state, action);

    console.info(
      "%c Next State",
      "font-weight: bold; color: #17A589;",
      nextState
    );

    return nextState;
  };
}

export default logger;
