const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        
        if (req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name');

            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');

    }catch(err){
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
  
}



module.exports.destroy = async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);
        console.log('Post found:', post);

        if (!post) {
            return res.redirect('back');
        }

        if (post.user == req.user.id) {
            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            await post.deleteOne();
            await Comment.deleteMany({ post: req.params.id });
            if(req.xhr){
                return res.status(200).json({
                    data: { 
                        post_id: req.params.id
                    },
                    message: 'Post deleted'
                })
            }
            req.flash('success','Posts and associated comments deleted!')
            return res.redirect('back');
        } else {
            //console.error('Error deleting post and comments:', err);
            req.flash('success','You cannot delete this post!')
            return res.redirect('back');
        }
      }catch(err) {
        req.flash('error',err)
        return res.redirect('back');
        //return res.status(500).send('Internal Server Error');
    }
};


// module.exports.destroy = function(req,res){
//     Post.findById(req.params.id)
//         .then(post => {
//         //.id means converting the object id into string
//             if (post.user == req.user.id){
//                 post.remove();

//                 Comment.deleteMany({post : req.params.id},function(err){
//                 return res.redirect('back');
//             });
//         }else{
//                 return res.redirect('back');
//             }
//         })
//         .catch(err =>{

//         });
//     }
        