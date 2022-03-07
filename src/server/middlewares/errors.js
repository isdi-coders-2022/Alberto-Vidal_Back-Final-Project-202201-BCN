const notFound = (req, res) => {
  res.status(404).json({ error: "resource not found" });
};

// eslint-disable-next-line no-unused-vars
const serverError = (err, req, res, next) => {
  const errorStatus = err.status ?? 500;
  const errorMessage = err.message ?? "internal server error";

  res.status(errorStatus).json({ error: errorMessage });
};

module.exports = { notFound };
