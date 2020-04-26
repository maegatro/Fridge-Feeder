const express = require('express');

const router = express.Router();

const queries = require('../db/queries');

function isValidId(req, res, next) {
  if(!isNaN(req.params.id)) return next();
  next(new Error('Invalid ID'));
}

function validItem(insidefridge) {
  const hasName = typeof insidefridge.name == 'string' && insidefridge.name.trim() != '';
  const hasDate = typeof insidefridge.expire_date == 'string' && insidefridge.expire_date.trim() != '';
  return hasName && hasDate;
}

router.get('/', (req, res) => {
  queries.getAll().then(insidefridge => {
    res.json(insidefridge);
  });
});

router.get('/:id', isValidId, (req, res, next) => {
  queries.getOne(req.params.id).then(insidefridge => {
    if(insidefridge) {
      res.json(insidefridge);
    } else {
      next();
    }
  });
});

router.post('/', (req, res, next) => {
  if(validItem(req.body)) {
    queries.create(req.body).then(insidefridge => {
      res.json(insidefridge[0]);
    })
  } else {
    next(new Error('Invalid item'));
  }
});



module.exports = router;