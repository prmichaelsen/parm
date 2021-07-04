import { functionGoogleMe } from "./index";
import { inspect } from 'util';

describe("function-google-me", () => {
  it("return the input value", async () => {
    // Mock ExpressJS 'req' and 'res' parameters
    const req = {
      query: {
        value: 'Hello World',
        apiSecret: process.env.apiSecret,
      },
    };
    const res = {
      send: jest.fn((x) => x),
      sendStatus: jest.fn((x) => x),
      status: jest.fn((x) => ({ send: jest.fn((x) => x) }))
    };

    // Call functionGoogleMe function
    const testResult = await functionGoogleMe(req, res);
    const { calls } = res.send.mock;

    console.log(inspect(testResult, false, null));
    expect(testResult).toBe('Hello World');
  }, 5000);
});
