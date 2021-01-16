const router=require('express').Router()
const {generateNumbers}=require('../controllers/service.controller')
router.post('/generate-numbers',generateNumbers)
module.exports=router  