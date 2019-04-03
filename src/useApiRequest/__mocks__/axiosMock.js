const things = [
  {
    id: 1,
    text: "wutz goin on?"
  },
  {
    id: 2,
    text: "o not much"
  }
];

const thangs = [
  {
    id: 9,
    text: "do you?"
  },
  {
    id: 8,
    text: "don't i?"
  }
];

const resources = { things, thangs };

export const axiosMock = {
  request: config => {
    const resource = config.url.split('/')[1];

    return Promise.resolve(resources[resource])
  }
};
