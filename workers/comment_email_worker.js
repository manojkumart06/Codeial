const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer');

//send the emails for us instead of sending it via controller
queue.process('emails', function(job, done){
    console.log('emails worker is processing a job',job.data);

    commentsMailer.newComment(job.data); 

    done();
});