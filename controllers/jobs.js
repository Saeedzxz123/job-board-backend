const express = require('express');
const Job = require('../models/job');
const isHR = require('../middleware/isHR');

const router = express.Router();



router.post('/', isHR, async (req, res) => {
  try {
    const { title, description, company } = req.body

    const job = await Job.create({
      title,
      description,
      company,
      createdBy: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
});



router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find()
  .sort({ createdAt: -1 })
  .populate('createdBy', 'username')

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

router.get("/:id" , async(req , res)=>{
  try{
    const {id} = req.params
    const job = await Job.findById(id)

    if(!job){
      res.status(404).json({error: "Job Not Found"})
    }
    else{
      res.status(200).json({job})
    }
  }
  catch(error){
    res.status(500).json({error:"Failed to get job"})
  }
})



router.put('/:id', isHR, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ err: 'Job not found' })
    }

    if (job.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ err: 'Not authorized' })
    }

    job.title = req.body.title ?? job.title
    job.description = req.body.description ?? job.description
    job.company = req.body.company ?? job.company

    await job.save();

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})


router.delete('/:id', isHR, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ err: 'Job not found' })
    }

    if (job.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ err: 'Not authorized' })
    }

    await job.deleteOne()

    res.status(200).json({ message: 'Job deleted successfully' })
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

module.exports = router
