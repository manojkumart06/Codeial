const Comment = require('../models/comment');
const Post = require('../models/post');



module.exports.create = async function (req, res) {
    try {
        const post = await Post.findById(req.body.post);

        if (post) {
            const comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            await post.save();
            res.redirect('/');
            //return res.status(200).json({ success: true, message: 'Comment added successfully' });
        } else {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
      } catch (err) {
        console.error('Error creating or saving comment:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

/*
module.exports.create = function(req, res){
    Post.findById(req.body.post)
        .exec()
        .then(post => {
            if (post){
                return Comment.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
                });
            }
        })
        .then(comment => {
            // handle success

            post.comments.push(comment);
            return post.save();
        })
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            // handle error
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
};*/



// deleting comment
module.exports.destroy = async function (req, res) {
    try {
        const comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id) {
            let postId = comment.post;
            
            // Remove the comment from the post's comments array
            const post = await Post.findByIdAndUpdate(
                postId,
                { $pull: { comments: req.params.id } },
                { new: true } // Return the modified post
            );

            // Delete the comment itself
            await comment.deleteOne();

            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.error('Error deleting comment:', err);
        return res.status(500).send('Internal Server Error');
    }
};

