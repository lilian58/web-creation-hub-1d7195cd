export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route introuvable: ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    success: false,
    message: err.message || "Erreur serveur",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
