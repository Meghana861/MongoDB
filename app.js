const express = require('express');
const { connectToDb, getDb } = require('./db');
const { ObjectId } = require('mongodb');
const app = express();
let db;
app.use(express.json());
connectToDb((err) => {
    if (!err) {
        db = getDb(); 

        app.listen(3000, () => {
            console.log('App listening on port 3000');
        });
    } else {
        console.error("Could not connect to the database:", err);
    }
});


//To Get All the Documents without pagination

// app.get('/users',(req,res)=>{
//     let users=[]
//     db.collection('users') //users collection
//     .find()
//     .sort({ name : 1 })
//     .forEach(user =>users.push(user) ) //users collection
//     .then(()=>{
// res.status(200).json(users)
//     })
//     .catch(()=>{
//         res.status(500).json({errror:'could not fetch the documnets'})
//     })
// })

//To Get the Single Document
app.get('/users/:id',(req,res)=>{
    const userId=req.params.id;
    if (ObjectId.isValid(userId)) {
        db.collection('users')
          .findOne({ _id: new ObjectId(userId) }) // Fetch the user by ID
          .then(user => {
              if (user) {
                  res.status(200).json(user);
              } else {
                  res.status(404).json({ error: 'User not found' });
              }
          })
          .catch(() => {
              res.status(500).json({ error: 'Could not fetch the user' });
          });
    } else {
        res.status(400).json({ error: 'Invalid user ID' }); // Handle invalid ID
    }
})

//Post Request

app.post('/users',(req,res)=>{
    console.log('Received user data:', req.body);
    const user=req.body
    // if (!user.name || !user.age || !user.gender) {
    //     return res.status(400).json({ error: 'Name, age, and gender are required' });
    // }
    db.collection('users')
    .insertOne(user)
    .then(result=>{res.status(201).json(result)})
    .catch(err=>{res.status(500).json({err:"Could not create users"})})
})

//To Delete Documents
app.delete('/users/:id',(req,res)=>{
    const userId=req.params.id;
    if (ObjectId.isValid(userId)) {
        db.collection('users')
          .deleteOne({ _id: new ObjectId(userId) }) // Fetch the user by ID
          .then(user => {
              if (user) {
                  res.status(200).json(user);
              } else {
                  res.status(404).json({ error: 'User not found' });
              }
          })
          .catch(() => {
              res.status(500).json({ error: 'Could not fetch the user' });
          });
    } else {
        res.status(400).json({ error: 'Invalid user ID' }); // Handle invalid ID
    }
})

//Update the Documents
app.patch('/users/:id', (req, res) => {
    const updates = req.body;
    const userId = req.params.id;

    if (ObjectId.isValid(userId)) {
        db.collection('users')
          .updateOne({ _id: new ObjectId(userId) }, { $set: updates })
          .then(result => {
            console.log(result)
              if (result.matchedCount > 0) {
                  res.status(200).json({ message: 'User updated successfully' });
              } else {
                  res.status(404).json({ error: 'User not found' });
              }
          })
          .catch(error => {
              console.error('Update error:', error); // Log the error
              res.status(500).json({ error: 'Could not update the user' });
          });
    } else {
        res.status(400).json({ error: 'Invalid user ID' }); // Handle invalid ID
    }
});


//To Get the Documents with pagination

app.get('/users',(req,res)=>{
    const page=req.query.p||0
    const usersPerPage=2
    let users=[]
    db.collection('users') //users collection
    .find()
    .skip(page*usersPerPage)
    .limit(usersPerPage)
    .sort({ name : 1 })
    .forEach(user =>users.push(user) ) //users collection
    .then(()=>{
res.status(200).json(users)
    })
    .catch(()=>{
        res.status(500).json({errror:'could not fetch the documnets'})
    })
})