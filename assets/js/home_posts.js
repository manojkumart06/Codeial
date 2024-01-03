
{
    //method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),//this converts postform to JSON
                success: function (data) {
                    try {
                       let newPost = newPostDom(data.data.post);
                       $('#post_list_container>ul').prepend(newPost);
                       deletePost($(' .delete-post-button', newPost));
                       new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                        //console.log(jsonData);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        console.log('Raw data received:', data);
                    }
                },error: function(err){
                    console.log(err.responseText);
                }
            });

        });
    }
    //method to create a post using DOM
    let newPostDom = function(post){
        return $(`<li id ="post-${post._id}">
        <p>
            <small>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
            </small>
            ${post.content}
            <br>
            <small>
                ${post.user.name}
            </small>
            
        </p>
    
         <div class ="post-comments">
            
            <form action="/comments/create" method="post">
                <input type="text" name="content" placeholder="Type here to add commnents...">
                <input type="hidden" name="post" value="${post._id}">
                <input type="submit" value="Add comment">
            </form>
           
            <div class="post-comments-list">
                <ul id="post-comments-${ post._id }">
                   
                </ul>
            </div>
         </div>
        </li>`)
    }

    //method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error : function(err){
                    console.log(err.responseText);
                }
            })

        })
    }



    createPost();
}


