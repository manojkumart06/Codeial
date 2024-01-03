const User = require('../models/user');
const fs = require('fs');
const path = require('path');



module.exports.profile = function (req, res) {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.redirect('/'); // Handle the case when the user is not found
            }

            // Render the user profile
            return res.render('users', {
                title: 'User Profile',
                profile_user: user
            });
        })
        .catch(err => {
            console.error("Error finding user:", err);
            return res.redirect('/');
        });
};

module.exports.update = async function(req,res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body)
    //     .then(user =>{
    //         return res.redirect('back');
    //     })
    //     .catch(err =>{
    //         return res.status(401).send('Unauthorized');
    //     })
    // }
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
            if(err){console.log("*****Multer Error",err)}

            //console.log(req.file);
            user.name = req.body.name;
            user.email = req.body.email;

            if(req.file){

                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                }

                //this is saving the path of the uploaded file into the avatar field in the user
                user.avatar = User.avatarPath + '/' + req.file.filename;
            }
             user.save();
             return res.redirect('back');
            });
        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
        
    }else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized');

    }

}

//MANUAL
/*module.exports.profile = function(req, res) {
     if (req.cookies.user_id) {
         User.findById(req.cookies.user_id)
             .then(user => {
                 if (user) {
                     return res.render('users', {
                         title: "Users profile",
                         user: user
                     });
                 } else {
                     return res.redirect('/users/sign_in');
                 }
             })
             .catch(err => {
                 console.error("Error finding user by ID:", err);
                 return res.redirect('/users/sign_in');
             });
     } else {
         return res.redirect('/users/sign_in');
     }
 };*/
 
 

//render user signup page
module.exports.signUP = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
     return res.render('user_sign_up',{
          title : "Sign_Up" 
     })
};

//render user signin page
module.exports.signIN = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

     return res.render('user_sign_in',{
          title : "Sign_In"
     })
};

//get the signup data
module.exports.create = function(req,res){
     if(req.body.password != req.body.Confirm_password){
          return res.redirect('back');
     }

     User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return User.create(req.body);
        } else {
            return Promise.reject("User already exists"); // or handle as needed
        }
    })
    .then(user => {
        return res.redirect('/users/sign_in');
    })
    .catch(err => {
        console.error("Error in signing up:", err);
        return res.redirect('back');
    });

}


module.exports.signOut = function (req, res) {
    // Perform sign-out actions, for example, clearing the session
    req.logout(function(err) {
        if (err) {
            console.error('Error during logout:', err);
            //return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        // Redirect to the home page or any desired destination after sign-out
        return res.redirect('/');
    });
};



/*MANUAL
//Sign In and create the session
module.exports.createSession = function(req,res){
     //steps to authenticate
     //find the user
     User.findOne({email:req.body.email})
     //handle user found
     .then(user =>{
          //handle password which doesn't match and handle user not found
          if(user.password!=req.body.password || !user){
               return res.redirect("back");
          }
          //handle session creation
          res.cookie("user_id",user.id);
          return res.redirect('/users/profile');
     })

     .catch(err =>{
          console.error("Error in finding user in signing in:", err);
          return res.redirect('back');
     })
}*/

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}

//console.log('user_controller'); //debugging

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success','You have Logged out');

    return res.redirect('/');
}