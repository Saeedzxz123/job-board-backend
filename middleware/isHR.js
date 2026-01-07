const isHR = (req, res, next) => {
  if (!req.user.isHR) {
    return res.status(403).json({ err: 'HR only access' })
  }
  next()
}

module.exports = isHR
