import React from "react";
import "jest-dom/extend-expect";

import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
import ComponentMock from "../__mocks__/componentMock";
import { axiosMock, axiosError } from "../__mocks__/axiosMock";

afterEach(cleanup);

describe("useApiRequest", () => {
  it("should make a single request", async () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <ComponentMock axios={axiosMock} />
    );

    fireEvent.click(getByText("Get Things"));
    expect(getByTestId("fetching-things")).toHaveTextContent("fetching things");
    await waitForElement(() => getByTestId("thing"));
    expect(getAllByTestId("thing").length).toBe(2);
  });

  it("should handle single request errors", async () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <ComponentMock axios={axiosError} />
    );

    fireEvent.click(getByText("Get Things"));
    expect(getByTestId("fetching-things")).toHaveTextContent("fetching things");
    await waitForElement(() => getByTestId("things-error"));
    expect(getByTestId("things-error")).toHaveTextContent(
      "welp, we've got an error"
    );
  });

  it("should make multiple concurrent requests", async () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <ComponentMock axios={axiosMock} />
    );

    fireEvent.click(getByText("Get Multiple Resources"));
    expect(getByTestId("fetching-thangs")).toHaveTextContent(
      "fetching multiple resources"
    );
    await waitForElement(() => getByTestId("thing"));
    await waitForElement(() => getByTestId("thang"));
    expect(getAllByTestId("thing").length).toBe(2);
    expect(getAllByTestId("thang").length).toBe(3);
  });

  it("should handle multiple concurrent requests errors", async () => {
    const { getByText, getByTestId } = render(
      <ComponentMock axios={axiosError} />
    );

    fireEvent.click(getByText("Get Multiple Resources"));
    expect(getByTestId("fetching-thangs")).toHaveTextContent(
      "fetching multiple resources"
    );
    await waitForElement(() => getByTestId("thangs-error"));
    expect(getByTestId("thangs-error")).toHaveTextContent(
      "welp, we've got an error"
    );
  });

  it("should make multiple sequential requests", async () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <ComponentMock axios={axiosMock} />
    );

    fireEvent.click(getByText("Get ThingThangs"));
    expect(getByTestId("fetching-thingThangs")).toHaveTextContent(
      "fetching thingThangs"
    );
    await waitForElement(() => getByTestId("thingThang"));
    expect(getAllByTestId("thingThang").length).toBe(2);
  });
});
