const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("./../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("notes");
  response.json(users.map(user => user.toJSON()));
});

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id).populate("notes");
  response.json(user.toJSON());
});

usersRouter.post("/", async (request, response) => {
  if (request.body.password.length < 3) {
    return response
      .status(400)
      .json({ error: "Password must be at least 3 characters long" });
  } else {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(request.body.password, saltRounds);

    const user = new User({
      username: request.body.username,
      name: request.body.name,
      passwordHash: passwordHash
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser.toJSON());
  }
});

module.exports = usersRouter;
