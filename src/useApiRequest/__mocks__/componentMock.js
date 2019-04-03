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
    resources: { things, thangs, thingThangs },
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

  const sequentialRequest = {
    things: {
      url: "/things/2",
      useApi: {
        keepFromState: true,
        next: {
          thingThangs: {
            url: "/thangs?thingId={{data.id}}"
          }
        }
      }
    }
  };

  return (
    <div>
      <button onClick={() => makeApiRequest(thingsRequest)}>Get Things</button>
      <button onClick={() => makeApiRequests(multiRequest)}>Get Multiple Resources</button>
      <button onClick={() => makeApiRequest(sequentialRequest)}>Get ThingThangs</button>

      {fetching.includes("things") && (
        <div data-testid="fetching-things">fetching things</div>
      )}
      {things &&
        things.data.length > 0 &&
        things.data.map(thing => <div data-testid="thing" key={thing.id}>{thing.text}</div>)}

      {fetching.includes("things-thangs") && (
        <div data-testid="fetching-multi">fetching multiple resources</div>
      )}
      {thangs &&
        thangs.data.length > 0 &&
        thangs.data.map(thang => <div data-testid="thang" key={thang.id}>{thang.text}</div>)}

      {fetching.includes('thingThangs') && (
        <div data-testid="fetching-thingThangs">fetching thingThangs</div>
      )}
      {thingThangs &&
        thingThangs.data.length > 0 &&
        thingThangs.data.map(thingThang => <div data-testid="thingThang" key={thingThang.id}>{thingThang.text}</div>)}
    </div>
  );
}

export default ComponentMock;
