export const protectRoute = (req, res, next) => {
  if (req.auth().isAuthenticated) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
