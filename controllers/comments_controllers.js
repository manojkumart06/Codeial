const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');


module.exports.create = async function (req, res) {
    try {
        const post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            await post.save();
            //Similar for comments to fecth the user's id!  
            comment = await comment.populate('user','name email');

            // commentsMailer.newComment(populatedcomment);
            //console.log('comment debug',comment);
            let job =  queue.create('emails', comment).save(function(err){
                if(err){
                    console.log("error in sending to the queue",err);
                    return;
                }
                console.log('job enqueued',job.id);
            })

            if(req.xhr){
               
                return res.status(200).json({
                    data : {
                        comment : comment
                    },
                    message : 'Post created!'
                });
            }
            req.flash('success','Comment published!')
            res.redirect('/');
            //return res.status(200).json({ success: true, message: 'Comment added successfully' });
        }
      } catch (err) {
        console.error('Error creating or saving comment:', err);
        req.flash('error', err);
        //return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// deleting comment
module.exports.destroy = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id) {
            let postId = comment.post;
            
            // Remove the comment from the post's comments array
            let post = await Post.findByIdAndUpdate(
                postId,
                { $pull: { comments: req.params.id } },
                { new: true } // Return the modified post
            );

            // Delete the comment itself
            await comment.deleteOne();
            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            req.flash('success', 'Comment deleted!');
            return res.redirect('back');
        } else {
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        console.error('Error deleting comment:', err);
        //return res.status(500).send('Internal Server Error');
    }
};
