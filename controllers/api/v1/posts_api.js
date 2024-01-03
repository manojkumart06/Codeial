const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async function(req,res){
    let posts = await Post.find({})
    .sort('-createdAt')
    .populate("user")
    .populate({
        path : 'comments',
        populate : {
            path : 'user'
        }
    });
    return res.status(200).json({
        message : 'List of posts',
        posts : posts
    })

}


module.exports.destroy = async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);
        console.log('Post found:', post);

        if (!post) {
            return res.redirect('back');
        }

        // f (post.user == req.user.id) {
            await post.deleteOne();
            await Comment.deleteMany({ post: req.params.id });
            
            
            return res.json(200,{
                message : "Post and associated comments deleted successfully"
            })
        // } else {
        //     //console.error('Error deleting post and comments:', err);
        //     req.flash('success','You cannot delete this post!')
        //     return res.redirect('back');
        // }
      }catch(err) {
        
        return res.json(500,{
            message: "Internal server Error"
        })
        //return res.status(500).send('Internal Server Error');
    }
};