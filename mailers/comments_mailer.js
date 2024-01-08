const { CommitStats } = require('git');
const nodeMailer = require('../config/nodemailer');

//this is another way of expoting a method
exports.newComment = (comment) => {
    console.log('inside newComment mailer',comment);

    nodeMailer.transporter.sendMail({
        from : 'kingsman@gamil.com',
        to : comment.user.email,
        subject : "New Comment Published",
        html : '<h1>yup,ohh your comment is now published!</h1>'
    },(err, info) => {
        if(err){
            console.log('Error in sending mail',err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}