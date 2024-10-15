const{MongoClient}=require('mongodb')
let dbConnection
module.exports={
    connectToDb: (cb) =>{
        MongoClient.connect('mongodb+srv://Meghana:1234@cluster0.lm8o0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')//Users--> DataBase Name
        .then((client)=>{
         dbConnection= client.db()
         return cb()
        })
        .catch(err=>{
            console.log(err)
            return cb(err)
        })
    },
    getDb: () =>dbConnection
}
