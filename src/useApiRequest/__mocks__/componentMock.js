import React from "react";
import { useApiRequest } from "../../index";
import { axiosMock } from "./axiosMock";

function ComponentMock() {
  const apiConfig = {
    axios: axiosMock,
    key: "testing",
    debug: true
  };
  const { state, makeApiRequest, makeApiRequests } = useApiRequest(apiConfig);
  const {
    fetching,
    resources: { things, thangs },
    errors
  } = state;

  const thingsRequest = {
    things: {
      url: "/things"
    }
  };

  const multiRequest = {
    things: {
      url: "/things"
    },
    thangs: {
      url: "/thangs"
    }
  };

  return (
    <div>
      <button onClick={() => makeApiRequest(thingsRequest)}>Get Things</button>
      <button onClick={() => makeApiRequests(multiRequest)}>Get Multiple Resources</button>
      {fetching.includes("things") && (
        <div data-testid="fetching-things">fetching things</div>
      )}
      {things &&
        things.length > 0 &&
        things.map(thing => <div data-testid="thing" key={thing.id}>{thing.text}</div>)}
      {fetching.includes("things-thangs") && (
        <div data-testid="fetching-multi">fetching multiple resources</div>
      )}
      {thangs &&
        thangs.length > 0 &&
        thangs.map(thang => <div data-testid="thang" key={thang.id}>{thang.text}</div>)}
    </div>
  );
}

export default ComponentMock;
