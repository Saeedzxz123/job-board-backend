const express = require('express');
const Job = require('../models/job');
const isHR = require('../middleware/isHR');

const router = express.Router();

router.post('/', isHR, async (req, res) => {
  try {
    const { title, description, company } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      createdBy: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('createdBy', 'username');

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

module.exports = router;
