const Post = require('../models/post');
const User = require('../models/user');
const Like = require('../models/like');

//using Async await
module.exports.home = async function(request,response){
    
    try{
        //await 1
        // CHANGE :: populate the likes of each post and comment
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('comments')
        .populate('likes');

        //await 2
        let users = await User.find({});

        return response.render('home',{
            title : "Home",
            posts : posts,
            all_users : users
        });
       }catch(err){
        console.log("error in posting", err);
        return;
    } 
}

//This is using promises
/*module.exports.home = function(request,response){
    //return response.end("<h1>your able to have controller for codial!!");
    //console.log(request.cookies);
    //response.cookie('user_id',30);
    //console.log(request.cookies);

    Post.find({})
    .populate("user")
    .populate({
        path : 'comments',
        populate : {
            path : 'user'
        }
    })
    .then(posts => {
        User.find({})
        .then(users => {
                return response.render('home',{
                    title : "Home",
                    posts : posts,
                    all_users : users
            })
       })
    })
    .catch(err => {
        console.log("error in posting", err);
        return;
    })

    // Post.find({}).populate('user').exec(function(err,posts){
    //     return response.render('home',{
    //         title : "HomE",
    //         posts : posts
    //     })
    // })
}*/