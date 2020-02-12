const express = require("express");
const multer  = require("multer");
const uuid = require("node-uuid")  
const fs = require("fs");

function getFileDate(date){
	return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + "_" 
	+ date.getHours() + ":" + date.getMinutes()+ ":" + date.getSeconds() + ":" + date.getMilliseconds();
}

const app = express();
 
// console.log(express.static(__dirname));

const storageConfig = multer.diskStorage({
	destination: (req, file, cb) =>{
		cb(null, "uploads");
	},
	filename: (req, file, cb) =>{
		cb(null, getFileDate(new Date()) + "-" + file.originalname);
	}
});

app.use(multer({storage:storageConfig}).single("filedata"));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/index.html");
});

app.get("/upload/:id", function(req, res){
	const path = __dirname + "/uploads/" + req.params.id;

	fs.access(path, fs.F_OK, (err) => {
		if (err) {
			res.sendStatus(404);
			return;
		} else {
			res.sendFile(path);
		}
	});
});

app.use(express.static(__dirname));
app.use(multer({dest:"uploads"}).single("filedata"));
app.post("/upload", function (req, res, next) {
	let filedata = req.file;
	console.log(filedata);
	if(!filedata){
		res.send("Ошибка при загрузке файла");
	}
	else{
		res.sendFile(__dirname + "/Upload_Sucsess.html");
	}
});
app.listen(3001);