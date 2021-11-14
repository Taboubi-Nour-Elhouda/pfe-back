var express = require('express');

const { route } = require('.');
var router = express.Router();

const Conference = require('../models/conferences.model');

router.get('/', (req, res) => {
  Conference.find({}, (err, conferences) => {
    res.json(conferences)
  })
})

router.post('/', (req, res) => {
  conference = new Conference({
    shortname: req.body.shortname,
    label: req.body.label,
    description: req.body.description,
    scientificdomain: req.body.scientificdomain,
    from: req.body.from,
    to: req.body.to,
    location: req.body.location,
    organizations: req.body.organizations,
    people: req.body.people,
    event: req.body.event,
    confadmin: req.body.confadmin,
    com_scientifique: req.body.com_scientifique,
    coordinator: req.body.coordinator,

  })
  conference.save(() => {
    res.json({'message':'created'})
  })
})

router.put('/:id', async (req, res) => {
  conference = await Conference.findByIdAndUpdate(req.params.id),
  conference.participants.push(req.body.participants);
  conference.save(()=>{
    res.json(conference)
  })
})
router.delete('/:id',(req,res)=>{
  Conference.findByIdAndDelete(req.param.id,(err)=>{
    res.json({'message':'deleted'})
  })
})
module.exports = router;
