var express = require('express');
var multer = require('multer');

const { route } = require('.');
var router = express.Router();
var path =require('path')
const Program = require('../models/program.model');

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './public/PDF');
  },
  filename: function (request, file, callback) {
    callback(null, file.originalname)
  },
});

const upload = multer({ storage: storage }).single('file');


router.get('/', (req, res) => {
  Program.find({}, (err, programs) => {
    res.json(programs)
  })
}) 


router.post('/file', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.status(501).json({ error: err });
    }
    res.send(req.file);
  });
});

router.get('/download',function(req,res) {
   filepath=path.join(__dirname,'../public/PDF'+'/'+req.query.filename);
   console.log(filepath);
   res.download(filepath);
})

router.post('/', (req, res) => {
  program = new Program({
    cv: req.body.cv,
    programname: req.body.programname,
    email: req.body.email,
    description: req.body.description,
    depositor: req.body.depositor,
    com_scientifique: req.body.com_scientifique,
    coordinator: req.body.coordinator,
    conference: req.body.conference,
    isValid:req.body.isValid,
    mailsent:req.body.mailsent
  })
  program.save(() => {
    res.json({ 'message': 'created' })
  })
})


router.put('/valid:id', async (req, res) => {
  programe = await Program.findByIdAndUpdate(req.params.id),
  programe.isValid= req.body.isValid;
  programe.save(()=>{
    res.json({ 'message': 'updated' })
  })
})
router.put('/mailsent:id', async (req, res) => {
  programe = await Program.findByIdAndUpdate(req.params.id),
  programe.mailsent= req.body.mailsent;
  programe.save(()=>{
    res.json({ 'message': 'updated' })
  })
})
router.delete('/:id', (req, res) => {
  Program.findByIdAndDelete(req.params.id, (err) => {
    res.json({ 'message': 'deleted' })
  })
})
module.exports = router;
