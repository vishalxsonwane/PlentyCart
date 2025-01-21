const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/groceryDB", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
