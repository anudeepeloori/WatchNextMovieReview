const exp = require("express")
const app = exp();
const path = require("path")



//connect angular app with express server
app.use(exp.static(path.join(__dirname, './dist/frontendproject1/')))

//import APIS
const userApi = require("./APIS/user-api")
const adminApi = require('./APIS/admin-api')
//import MongoCLient
const { MongoClient } = require("mongodb");



//connection string
const databaseObjFromEnv=process.env.MONGO_URL
const databaseUrl = databaseObjFromEnv;

(async () => {
    try {
        const client = new MongoClient(databaseUrl);
        await client.connect();
        console.log("✅ Successfully connected to MongoDB Atlas");

        // Get database object
        const databaseObj = client.db("WatchNextMovies");

        // Create collection objects
        const userCollectionObj = databaseObj.collection("usercollection");
        const ratingCollection = databaseObj.collection("ratingcollection");
        const contactsCollection = databaseObj.collection("contactscollection");
        const reviewCollection = databaseObj.collection("reviewCollection");

        // Store in app locals
        app.set("userCollectionObj", userCollectionObj);
        app.set("ratingcollection", ratingCollection);
        app.set("contactscollection", contactsCollection);
        app.set("reviewCollection", reviewCollection);

        console.log("✅ Database and collections set up");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // Exit process if DB connection fails
    }
})();




//execute specific api based on path
app.use("/user", userApi)
app.use("/admin", adminApi)




//invalid path
app.use((req, res, next) => {

    res.send({ message: `path ${req.url} is invalid` })
})

//error handling middleware
app.use((err, req, res, next) => {
    res.send({ message: `error is ${err.message}` })
})


//assign port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`server on ${port}...`))