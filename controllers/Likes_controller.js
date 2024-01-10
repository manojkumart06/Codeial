const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");

//action
module.exports.toggleLike = async function(req,res){
    try{
        //like/toggle/?id=abcdef&type=post
        let likable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likable = await Post.findById(req.query.id).populate('likes');
        }else{
            likable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if like is already existing
        let existingLike = await Like.findOne({
            likable : req.query.id,
            onModel : req.query.type,
            user : req.user._id
        })

        //if like already existing then delete it
        if(existingLike){
            likable.likes.pull(existingLike._id);
            likable.save();

            existingLike.remove();
            deleted = true;
        }else{
            //else make a new like
            let newLike = await Like.create({
                user : req.user._id,
                likable : req.query.id,
                onModel : req.query.type
            });
            
            likable.likes.push(like._id);
            likable.save();
        }

        return res.json(200,{
            message : 'Request successful!',
            data : {
                deleted : deleted
            }
        })

    }catch(err){
        console.log(err);
        return res.json(500,{
            message : 'Internal server error'
        });
    }
}