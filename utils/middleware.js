// TOken Extractor
const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
  }
  next();
};

// Unknown Endpoint Handler
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown endpoint " });
};

// Error Handler
const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).send({ error: "malformatted id " });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

module.exports = {
  tokenExtractor,
  unknownEndpoint,
  errorHandler
};
