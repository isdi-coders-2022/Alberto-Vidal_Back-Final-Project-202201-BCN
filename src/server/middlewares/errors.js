const notFound = (req, res) => {
  res.status(404).json({ error: "resource not found" });
};

module.exports = { notFound };
