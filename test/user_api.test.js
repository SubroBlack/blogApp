const uniqueValidator = require("mongoose-unique-validator");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const User = require("../models/user");
const testHelper = require("./test_helper");

beforeEach(async () => {
  await User.deleteMany({});

  const userObjects = testHelper.initialUsers.map(user => new User(user));
  const promiseArray = userObjects.map(user => user.save());
  await Promise.all(promiseArray);
  console.log("ALL DONE!!!!");
});

describe("Invalid User cannot be Added", () => {
  test("User cannot be added without password", async () => {
    const newUser = {
      username: "testDude",
      name: "His Dudeness",
      password: ""
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400);
  });

  test("User cannot be added without username", async () => {
    const newUser = {
      name: "His Dudeness",
      password: "DAMN"
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
