const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post('/sign-up', async (req, res) => {
  try {
    const { username, password, isHR } = req.body;

    if (!username || !password) {
      return res.status(400).json({ err: 'Missing fields' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ err: 'Username already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      isHR
    });

    const payload = { _id: user._id, isHR: user.isHR };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({ token });

  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ err: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ err: 'Invalid credentials' });
    }

    const payload = { _id: user._id, isHR: user.isHR };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({ token });

  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

module.exports = router;
