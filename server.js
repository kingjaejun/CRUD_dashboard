const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const { connect } = require('mongodb');
const { query } = require('express');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://kingjaejun:180200@cluster0.4pxwx.mongodb.net/test?retryWrites=true&w=majority';

MongoClient.connect(url, {useUnifiedTopology:true})
    .then(client =>{
        app.listen(3000, function() {
            console.log('listening on 3000')
        });
        const db = client.db('jeajun-palace')
        const palaceCollection = db.collection('quotes')
        console.log('Connected to Database')

        app.use(bodyParser.urlencoded({extended:true}))
        app.use(express.static('public'))
        app.use(bodyParser.json())
        app.set('view engine', 'ejs')
        
        app.put('/quotes',(req,res)=>{
            palaceCollection.findOneAndUpdate(
                {name:'Kingjaejun'},
                {
                    $set: {
                        name: req.body.name,
                        quote:req.body.quote
                    }
                },
                {
                    upsert:true
                }
            )
        .then(result =>{
            res.json('Success')
        })
        .catch(error => console.error(error))
        })

        app.delete('/quotes', (req, res) => {
            palaceCollection.deleteOne(
              { name: req.body.name }
            )
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.json('No quote to delete')
                }
                res.json('Deleted Darth Vadar\'s quote')
                })
            .catch(error => console.error(error))
        })

        app.get('/',function(req,res){
            db.collection('quotes').find().toArray()
            .then(results => {
                res.render('index.ejs',{ quotes:results })
            })
            .catch(error => console.error(error))
            
        })
        
        app.post('/quotes',(req,res)=>{
            palaceCollection.insertOne(req.body)
            .then(result =>{
                res.redirect('/')
            })
            .catch(error => console.error(error))
        })
})
.catch(error => console.error(error))

