/* ===================================================
 * Contains all of the events, server communication
 * and functionality of the Forums - without this it
 * does mostly nothing.
 * ==================================================== */




/* ===================================================== 
 * AJAX CALLS - all of the server communication bits
 * ===================================================== */


// do the ajax call to grab ALL the posts
function getPosts() {
    $.ajax({
        url: "/forum/getPosts",
        context: document.body,
        success: function (data) {
            buildStream(data);
        }
    });
}

function postCreatedPost(postTitle, postBody)
{
    $.ajax( {
        url: "/forum/createPost",
        type: "POST",
        data: "postTitle=" + postTitle + "&postBody=" + encodeURI(postBody)
    } ).done( function ( data )
    {
        // Since we are iterating through these posts in order - and oldest will come first
        // append the posts to the top of the parent container.
        appendToDataStream(createPost(data));

    } );
}


// Two very important things to remember about this
// we dont have a difinitive way to grab the user
// from the current context - so only post the pertinent
// bits and remember to do transforms on the backend.
function postComment(postID, comment) {
    $.ajax( {
        url: "/forum/postComment",
        type: "POST",
        data: "postID=" + postID + "&comment=" + encodeURI( comment )
    } ).done( function ( data )
    {
        appendReplyToParentContainer( data, postID );
    } );
    
}

function deletePost(postID) {
		$.ajax({
		 url: "/forum/deletePost",
		 type: "POST",
		 data: "postID=" + postID
		}).done(function(data)
		{
			alert('deleted post');
		});
}

/* ===========================================================================
 *  DOM appendage 
 *  ========================================================================== */

function appendToDataStream(artifact)
{
	$('#datastream').prepend(artifact);
}

function appendReplyToParentContainer(reply, postID)
{
	var parentContainer = $('#' + postID);
	parentContainer.append(createReply(reply));
}

/* =============================================================================
 * Object Factory
 * ============================================================================= */

function appendReplyToParentObject(reply, post)
{
	var replyContainer = $(post).find('.replyscontainer');
	$(replyContainer).append(reply);
	return post;
}

function createPost(data)
{

        var postcontainer = $( "<div class='span8 postcontainer' id=" + data.postID + "></div>" );
        var title = $( "<h3 class='hero-title'></h3>" ).append( data.postTitle );
        var toolbox = $("<span class='span12 toolbox'></span>");
				var meta = $( "<h6></h6>" ).append( data.postDate + " - " + data.postedBy );
        var body = $( "<div class='row12'></div>" ).append( data.postBody );

        var replys = $( '<div class="span6 replyscontainer"></div>' );

        $( postcontainer ).append( title, toolbox, meta, body, replys ).hide().fadeIn(800);
				
				// append the action to the container before returning
				bindReplyDisplay(postcontainer);
				bindTrashIcon(postcontainer);
				return postcontainer;
}



function createReply( data )
{
    // Create a reply container, then fill it with the reply bits for display
		var reply = $("<div></div>").addClass("reply-div");
		var rmeta = $( "<h6></h6>" ).append( data.postDate + " - " + data.postedBy ).hide().fadeIn( 400 );
    var rbody = $( "<div class='span6 reply'></div>" ).append( data.postBody ).hide().fadeIn( 400 );
    $(reply).append(rmeta, rbody);
		return reply
}



/* ==================================================================================
 * In page events - bind actions to different elements for interactivity
 * ================================================================================== */


// Event to display the "click to add reply"
// simply shows an overlay arrow on the post title.
function bindReplyDisplay(postContainer)
{
    // Check the site wide cookie thats set after login
    // Do not display any of the front end elements when
    // they are not signed in. 
    if ($.cookie("Username") === null) 
    {
        return;
    }

        $( postContainer ).find( ".toolbox" ).append( 
								
								'<button class="reply-button"><i class="icon-share-alt"></i></button>'
								);
		
		bindReplyBoxEvents(postContainer);

		return postContainer;
}



// Event to display the "click to add reply"
// simply shows an overlay arrow on the post title.

function bindReplyBoxEvents(postcontainer)
{
    var button = $( postcontainer ).find('.reply-button');

		$( button ).click( function ()
    {

        if ( last_key_pressed != null )
        {
            var last_key_pressed;
        }

        // If the ReplyBox is on the page, dont display it again.
        if ( $( '#ReplyBox' ).length != 0 )
				{
					return;
				}
            
            {
								//find the container. apply the comment box
                $( postcontainer ).find( '.replyscontainer' )
									.append( $( "<textarea></textarea>" )
									.attr( "id", "ReplyBox" )
									.height( "215px" )
									.width( "455px" )
								 	);
                
								$( '.replyscontainer textarea' ).focus();


                // This is an event binder, and it fires after the user
                // presses a key. 
                $( '#ReplyBox' ).keyup( function ( e )
                {
                    // Enter key // If the contents of the textarea is not null
                    // and the enter key is pressed twice - submit the data 
                    if ( e.keyCode === 13 )
                    {

                        // if they pressed enter twice, and the length of the textbox has more than
                        // five characters -- submit the data
                        if ( last_key_pressed == 13 && $.trim( $( '.replyscontainer textarea' ).val() ).length > 5 )
                        {
                            var postID = $( '#ReplyBox' ).closest( '.postcontainer' ).attr( 'id' );
                            var comment = $( '.replyscontainer textarea' ).val();

                            // display a neat fade out and remove the container
                            $( '.replyscontainer textarea' ).remove(); ;

                            postComment( postID, comment );

                        }
                    }


                    // Esc Key // remove the text box when they press esc
                    if ( e.keyCode === 27 )
                    {
                        $( '.replyscontainer textarea' ).remove();
                    }

                    // Assign after we have completed everything so we get an accurate capture of the last keypress
                    last_key_pressed = e.keyCode;
                } ); 
            }
        
    } );
}

function bindTrashIcon(postContainer)
{
    // Check the site wide cookie thats set after login
    // Do not display any of the front end elements when
    // they are not signed in. 
    if ($.cookie("Username") != "admin")
    {
        return;
    }

					var button = $('<button class="btn-danger"><i class="icon-trash"></i></button>');
					button.click(trashModal(button));
							
        $( postContainer ).find( ".toolbox" ).append(button);

		return postContainer;

}

function trashModal(artifact)
{
	$(artifact).click(function() {
		$('#DeleteModal').modal('toggle');
	});
}



/* ===================================================================================
 * Page initialization 
 * =================================================================================== */


// Build the full data-stream of posts
function buildStream(data) {
    // If we have no data - do nothing
    if (data.length === 0) {
        return null;
    }
    // Load the data into Javascript Objects
    data = JSON.parse(data);

    for (i = 0; i < data.length; i++) {
				
				var post = createPost(data[i]);

				// each post has an array of replys - process those
        for (j = 0; j < data[i].Replys.length; j++) {
            appendReplyToParentObject(
														createReply(data[i].Replys[i]),
													 	post
														);
        }
			appendToDataStream(post);
    }
}

function initializePage()
{
    // be persnickety - if the user is not logged in - dont show them any of the main interaction elements
    if ( $.cookie( "Username" ) != null )
    {
        $( '#writerBox' ).show();
    	
			// anonymous function to bind interactivity to the Compose new post elements
				
				$( 'textarea[name=postBody]' ).keyup( function ( e ) {
							if ( e.keyCode === 13 ){
           		 
										if ( $( 'input[name=postTitle]' ).val().length >= 2 
										&& $( 'textarea[name=postBody]' ).val().length >= 5
									 	&& last_key_pressed === 13 )
            				{
                			postCreatedPost( $( 'input[name=postTitle]' ).val(), $( 'textarea[name=postBody]' ).val() );


											// okay we are building a post - now lets get sneaky with teh UI
											$( '#write' ).fadeOut( 600 ).delay( 50000 ).fadeIn( 600 );
											$( 'input[name=postTitle]' ).val( "" );
											$( 'textarea[name=postBody]' ).val( "" );

										}
        				}

        		last_key_pressed = e.keyCode;

			});
		}
}

// Consider this the constructor - run on page load
$( 'document' ).ready( function ()
{

	initializePage();

	// pull the posts via AJAX from the controller method
  getPosts();


} );





