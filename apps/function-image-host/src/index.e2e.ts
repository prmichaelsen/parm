import Supertest from "supertest";
const superTest = Supertest("http://localhost:8080");

describe.skip("function-image-host e2d", () => {
  it("return Hello World", async () => {
    await superTest
      .post("?value=JoelCode")
      .expect(200)
      .expect((response) => {
        // console.log(response.text);
        expect(response.text).toBe("JoelCode");
      });
  });
});
