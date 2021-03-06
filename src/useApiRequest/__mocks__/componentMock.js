import React from 'react'
import { useApiRequest } from '../../index'

/* eslint-disable-next-line react/prop-types */
function ComponentMock({ axios }) {
  const apiConfig = {
    axios: axios,
    key: 'testing',
    debug: true
  }
  const { state, makeApiRequest, makeApiRequests } = useApiRequest(apiConfig)
  const {
    fetching,
    resources: { things, thangs, thingThangs },
    errors
  } = state

  const thingsRequest = {
    things: {
      url: '/things'
    }
  }

  const multiRequest = {
    thangs: {
      url: '/thangs'
    },
    things: {
      url: '/things'
    }
  }

  const sequentialRequest = {
    thingThangs: {
      url: '/things/2',
      next: {
        url: '/thangs?thingId={{data.id}}'
      }
    }
  }

  return (
    <div>
      <button onClick={() => makeApiRequest(thingsRequest)}>Get Things</button>
      <button onClick={() => makeApiRequests(multiRequest)}>
        Get Multiple Resources
      </button>
      <button onClick={() => makeApiRequest(sequentialRequest)}>
        Get ThingThangs
      </button>

      {fetching.includes('things') && (
        <div data-testid='fetching-things'>fetching things</div>
      )}
      {things &&
        things.data.length > 0 &&
        things.data.map(thing => (
          <div data-testid='thing' key={thing.id}>
            {thing.text}
          </div>
        ))}
      {errors.things && (
        <div data-testid='things-error'>{errors.things.message}</div>
      )}

      {fetching.includes('thangs') && (
        <div data-testid='fetching-thangs'>fetching multiple resources</div>
      )}
      {thangs &&
        thangs.data.length > 0 &&
        thangs.data.map(thang => (
          <div data-testid='thang' key={thang.id}>
            {thang.text}
          </div>
        ))}
      {errors.thangs && (
        <div data-testid='thangs-error'>{errors.thangs.message}</div>
      )}

      {fetching.includes('thingThangs') && (
        <div data-testid='fetching-thingThangs'>fetching thingThangs</div>
      )}
      {thingThangs &&
        thingThangs.data.length > 0 &&
        thingThangs.data.map(thingThang => (
          <div data-testid='thingThang' key={thingThang.id}>
            {thingThang.text}
          </div>
        ))}
    </div>
  )
}

export default ComponentMock
