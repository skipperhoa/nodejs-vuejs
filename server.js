var express =  require('express');
var app      = express();
var jsonfile = require('jsonfile');
var path = require('path');
var fs = require('fs');
var multer  = require('multer');
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(express.static(__dirname + '/uploads'));
app.use(bodyParser.json());
app.use(cors());
var file = __dirname+'/data/items.json';
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });


app.post("/add",function(req,res){
	var sanpham = req.body;
	var data=jsonfile.readFileSync(file);
	 data.sanphams.push({
              "masp":sanpham.masp,
              "name":sanpham.name,
              "price":sanpham.price,
              "image":"uploads/"+sanpham.image
            });
    fs.writeFile('data/items.json', JSON.stringify(data), 'utf-8', function(err) {
      if (err) throw err
      console.log('Done!');
    });
   
    res.json(data);
});
app.post('/update',function(req,res){
	var data_list=jsonfile.readFileSync(file);//get dữ liệu
	var sanpham = req.body;
	var f=0;
	var xacnhan=0;
	while(f<data_list['sanphams'].length){
              if(data_list['sanphams'][f].masp==sanpham.masp){
                xacnhan=1;
                break;
              }
              f++;
    }
   // return res.json(data_list['sanphams'][f]);
    if(xacnhan>0){
    	data_list['sanphams'][f]={
              "masp":sanpham.masp,
              "name":sanpham.name,
              "price":sanpham.price,
              "image":"uploads/"+sanpham.image.replace("uploads/","")
            };
    	//console.log(data_list['sanphams']);
    	
	    fs.writeFile('data/items.json', JSON.stringify(data_list), 'utf-8', function(err) {
	      if (err) throw err
	      console.log('Done!');
	  	return res.json({"vitri":f});
	    });
    }
    else{
    	return res.json("success");
    }

});
app.get('/delete/:masp',function(req,res){
  var data_list=jsonfile.readFileSync(file);//get dữ liệu
  var masp = req.params.masp;
  var f=0;
  var xacnhan = 0;
  while(f<data_list['sanphams'].length){
      if(masp == data_list['sanphams'][f].masp){
        xacnhan = 1;
        break;
      }
      f++;
  }
  //neu xac nhan bang 1 la ton tai co masp
  if(xacnhan>0){
   
   
    var deletedItem = data_list.sanphams.splice(f,1);
     fs.writeFile('data/items.json', JSON.stringify(data_list), 'utf-8', function(err) {
      if (err) throw err
      console.log('Done!');
      return res.json(data_list);
    });
  }
  else{
   return res.json("Khong ton tai");
  }

});
app.get('/getItems',function(req,res){
  var data = jsonfile.readFileSync(file);
  
   return res.json(data['sanphams']);
});
app.post('/uploads', upload.single('image'), (req, res) => {
   console.log(req.body);
    return res.json(req.body);
});
http.listen(process.env.PORT || 8888, function(){
  console.log('listening on *:8888');
});