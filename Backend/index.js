const express = require('express')
const multer = require("multer");
const cors = require ("cors");
const docxToPDF = require('docx-pdf');
const path = require("path");

const app = express()
const port = 3000

app.use(cors()); // enabling cors for cross origin request

// creating or setting up file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')  //' uploads' refers to file location 
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname) // 'original name refer to , when user will upload the file , the name of the file will b original means the name of the of file 
    }
  })
  
  const upload = multer({ storage: storage });
  app.post('/conertFile', upload.single('file'), function (req, res, next) { // post request
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    try{

        if(!req.file){          // when user doesnt upload any file 
            return res.status(400).json({
                message:"No file is uploaded",
            });
        }
        //defining output file path
        let outputPath =path.join(__dirname,"files",`${req.file.originalname}.pdf`) // to download the with the same name 
        docxToPDF(req.file.path, outputPath,function(err,result){
            if(err){
              console.log(err);
              return res.status(500).json({
                message:"Error converting doxc to pdf",
            });
            }
            res.download(outputPath,() => {
                console.log("file downloaded Succesfully");
            });
           });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Internal server error",
        });

    }
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});