import React from "react";
import "jest-dom/extend-expect";

import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
import ComponentMock from "../__mocks__/componentMock";

afterEach(cleanup);

describe("useApiRequest", () => {

  it("should make a single request", async () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <ComponentMock />
    );

    fireEvent.click(getByText("Get Things"))
    expect(getByTestId("fetching-things")).toHaveTextContent("fetching things");
    await waitForElement(() => getByTestId("thing"));
    expect(getAllByTestId("thing").length).toBe(2);
  });

  it("should make multiple concurrent requests", async () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <ComponentMock />
    );

    fireEvent.click(getByText("Get Multiple Resources"))
    expect(getByTestId("fetching-multi")).toHaveTextContent("fetching multiple resources");
    await waitForElement(() => getByTestId("thing"));
    await waitForElement(() => getByTestId("thang"));
    expect(getAllByTestId("thing").length).toBe(2);
    expect(getAllByTestId("thang").length).toBe(3);
  });

  it("should make multiple sequential requests", async () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <ComponentMock />
    );

    fireEvent.click(getByText("Get ThingThangs"))
    // expect(getByTestId("fetching-thingThangs")).toHaveTextContent("fetching thingThangs");
    await waitForElement(() => getByTestId("thingThang"));
    expect(getAllByTestId("thingThang").length).toBe(2);
  });
});
