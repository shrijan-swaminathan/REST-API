const express = require('express') //adds express
var bodyParser     =        require("body-parser"); //adds body-parser (middle ware for express, which was necessary)
const app = express() //sets the app as express function

const fs = require('fs') //requires filestream
var parse = require('csv-parse') //requires a parser for .csv files(comma separated files) in order to convert to json when reading

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000//access the api via port 3000 in localhost

//javascript uses only var to create a variable and it would detect its type
//also you would create methods by using the word "function" instead of p.s.(type)
function MyCSV(cols, dataval) {//created a function
	//this function is meant to organize the data into .json format so its much easier to look at
	var retval = '{\n"result": {'
	//split the columns and remove all commas for the two lines below
	var colnames  = cols.split(",");
	var data  = dataval.split(",");	
		for(var i=0;i<colnames.length;i++){

			var c  = colnames[i].replace('"', "")
			
			if(i != colnames.length-1){
				if(c != "")
					retval  += '{"' + c + '": "' + data[i] + '" },';
			}
			else{
				if(c != "")
					retval  += '{"' + c + '": "' + data[i] +  '" }}}';
				else
					retval  += '}}';
			}
		}
		return(retval)
}; 


function streamToString(stream, cb) {//converts the buffer to a string
  const chunks = [];
  stream.on('data', (chunk) => {
    chunks.push(chunk.toString());
  });
  stream.on('end', () => {
    cb(chunks.join(''));
  });
}

app.get('/', (req, res) => res.send('Hello World!'))//this is just for testing whether the api is working; type in IpAddress:3000 onto any browser once running and it should say Hello World
app.post('/lookup',function(req,res){//if you add /lookup, you would be able to lookup the csv file
var studentid=req.body.studentid;//this is what is required for the program to work [Student Id]

//Side Note: you can convert any excel file into csv by opening excel, save as filename.csv. it should also work on google sheets
var inputPath = 'APCSGrades121419.csv'//this is the absolute file path of the file

let stream = fs.createReadStream(inputPath);//reads the path of the csv file
streamToString(stream, (data) => {//calls stream to string function
	var rows  = data.toString().split("\r\n");//splits the rows by nextline which it \r\n
		console.log(rows.length)//stores this
		for(var i=0;i<rows.length;i++){//this loop logs the first row with the row that is intended: E.g the first row would be "AP CS": "(insert id number)" and does this until it reaches the end of the file
			var cols  = rows[i].split(",");	
			if(cols[0] == studentid){
				var result = MyCSV(rows[0], rows[i])	
			res.end(result);		
		}
	}
});

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))