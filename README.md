# use-api-request

> A simple React hook for making network requests using Axios.

[![NPM](https://img.shields.io/npm/v/use-api-request.svg)](https://www.npmjs.com/package/use-api-request)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.com/jmpolitzer/use-api-request.svg?branch=master)](https://travis-ci.com/jmpolitzer/use-api-request)
[![Coverage Status](https://coveralls.io/repos/github/jmpolitzer/use-api-request/badge.svg?branch=master)](https://coveralls.io/github/jmpolitzer/use-api-request?branch=master)

## Install 

```
npm install --save use-api-request
```

## Example

```javascript
import axios from 'axios';
import { useApiRequest } from 'use-api-request';

function MyComponent() {
  const apiConfig = {
    axios: axios.create({
        baseURL: "https://whereami.com/"
    }),
    key: "example",
    debug: true
  };

  const { state, makeApiRequest } = useApiRequest(apiConfig);
  const { fetching, resources: { posts }, errors } = state;

  const requestConfig = {
     posts: {
        url: "/posts"
      }
  };

  return (
    <>
      <button onClick={() => makeApiRequest(requestConfig)}>Get Posts</button>
      <>
        {fetching.includes("posts") && <div>fetching</div>}
        {posts.data.length > 0 && posts.data.map(post =>
            <div key={post.id}>{post.title}</div>) }
        {errors.posts && <div>{errors.posts.message}</div>}
      </>
    </>
  );
}
```

## Usage

1. Pass a config object with an Axios instance and a unique `key` string into `useApiRequest`. The Axios instance takes the exact same configurations as specified in the [documentation](https://www.npmjs.com/package/axios). Optionally include a `debug` flag if you'd like to see redux-like logging in your console.

2. Create a request object -- again, refer to the [Axios documentation](https://www.npmjs.com/package/axios) for examples -- and pass it into `makeApiRequest`. Note that this library uses `Axios.request()` under the hood. The request object is nothing more than an Axios request config object assigned to a resource key of your choosing. So, if you name the key `things`, you will find `things` many times within the state object. See below for more details.

3. Call `makeApiRequest` and look for your response on the resources key of the `state` object provided by `useApiRequest`.

## Features

Make a single request:
    
 ```javascript
 const singleRequestConfig = {
    posts: {
      url: "/posts"
    }
  };

 makeApiRequest(singleRequestConfig);
 ```
   
Make multiple concurrent requests:
  
  ```javascript
  const concurrentRequestsConfig = {
      albums: {
        url: "/albums"
      },
      users: {
        url: "/users"
      }
    };

  makeApiRequests(concurrentRequestsConfig);
  ```

Make a sequential request (dependent variables are wrapped in double curly brackets and will always be properties of `data`): 

  ```javascript
  const sequentialRequestConfig = {
      userPosts: {
        url: "/posts/1",
        next: {
          url: "/posts?userId={{data.userId}}"
        }
      }
    };

  makeApiRequest(sequentialRequestConfig);
  ```
  
## API

```javascript
const { state, makeApiRequest, makeApiRequests } = useApiRequest(apiConfig);
const { fetching, resources, errors } = state;
```

`fetching` - array of strings corresponding to the resource key(s) used in the request config

`resources` - object of successful responses; each response can be found under the key used in the request config, and each response contains the entire response generated by Axios

`errors` - object of errors; each error can be found under the key used in the request config, and each error contains the entire error generated by Axios
 
## License

MIT © [jmpolitzer](https://github.com/jmpolitzer)
