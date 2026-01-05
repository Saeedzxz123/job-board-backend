const express = require('express');
const Application = require('../models/application');
const Job = require('../models/job');

const router = express.Router();

// APPLY FOR JOB (USER)
router.post('/', async (req, res) => {
  try {
    const { job, cvUrl } = req.body;

    if (!job || !cvUrl) {
      return res.status(400).json({ err: 'Missing data' });
    }

    const application = await Application.create({
      job,
      cvUrl,
      user: req.user._id
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

// USER: GET MY APPLICATIONS
router.get('/my', async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user._id
    })
      .populate('job', 'title company');

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

router.get('/hr', async (req, res) => {
  try {
    if (!req.user.isHR) {
      return res.status(403).json({ err: 'HR only' });
    }

    const jobs = await Job.find({ createdBy: req.user._id });
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({
      job: { $in: jobIds }
    })
      .populate('user', 'username')
      .populate('job', 'title company');

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

module.exports = router;
