var express = require('express');
var router = express.Router();

router.get('/get-rooms',function(req,res){
	res.render('get_room');
});

router.get('/:room_name',function(req,res){
	res.render('room',{'room_name':req.params.room_name});
});

module.exports = router;