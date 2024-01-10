const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
    },
    //This defines object id of the liked object
    likable : {
        type : mongoose.Schema.ObjectId,
        require : true,
        refPath : 'onModel'
    },
    //This field is used for defining the type of the liked object since this is a Dynamic reference
    onModel : {
        type : String,
        require : true,
        enum : ['Post','Comment']
    },
},{
    timestamps : true
});

const like = mongoose.model('Like',likeSchema);

module.exports = like;