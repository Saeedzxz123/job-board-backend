const express = require('express');
const Application = require('../models/application');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const application = await Application.create({
      job: req.body.job,
      cvUrl: req.body.cvUrl,
      user: req.user._id
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ err:'something went wrong' });
  }
});

router.get('/my', async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user._id })
      .populate('job');

    res.status(200).json(apps);
  } catch (err) {
    res.status(500).json({ err: 'something went wrong' });
  }
});

module.exports = router;
