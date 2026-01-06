const express = require('express');
const Application = require('../models/application');
const Job = require('../models/job');
const upload = require('../middleware/uploadCV')
const uploadToS3 = require('../utils/uploadToS3')


const router = express.Router();


router.post('/', upload.single('cv'), async (req, res) => {
  try {
    const { job } = req.body
    if (!job || !req.file) {
      return res.status(400).json({ err: 'Missing data' })
    }

    const cvUrl = await uploadToS3(req.file, req.user._id, job)

    const application = await Application.create({
      job,
      user: req.user._id,
      cvUrl
    })
        console.log('BODY:', req.body);   // 🔍 ADD
    console.log('FILE:', req.file);   // 🔍 ADD
    console.log('USER:', req.user);   // 🔍 ADD


    res.status(201).json(application)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})


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
