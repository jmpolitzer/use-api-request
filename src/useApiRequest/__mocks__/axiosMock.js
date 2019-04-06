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
    text: "do you?",
    thingId: 2
  },
  {
    id: 8,
    text: "don't i?",
    thingId: 2
  },
  {
    id: 7,
    text: "ok kewl",
    thingId: 1
  }
];

const getDependentData = resource => {
  const params = resource.split("?");
  const query = params[1].split("=");

  return resources[params[0]].filter(
    resource => resource[query[0]] === parseInt(query[1])
  );
};

const resources = { things, thangs };

export const axiosMock = {
  request: config => {
    const urlFragments = config.url.split("/");
    const resource = urlFragments[1];
    const data = config.url.includes("?")
      ? getDependentData(resource)
      : urlFragments.length === 2
      ? resources[resource]
      : resources[resource].find(_res => _res.id === parseInt(urlFragments[2]));

    return Promise.resolve({ data });
  }
};

export const axiosError = {
  request: config => {
    const urlFragments = config.url.split("/");
    const resource = urlFragments[1];
    let error = new Error("welp, we've got an error");

    error.config = { headers: { resourceKey: resource } };

    return Promise.reject(error);
  }
};
