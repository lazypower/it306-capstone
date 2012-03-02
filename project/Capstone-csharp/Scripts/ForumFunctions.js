

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
        appendReply( data );
    } );
    
}


function appendReply( data )
{
    var rmeta = $( "<h6></h6>" ).append( data.postDate + " - " + data.postedBy ).hide().fadeIn( 2000 );
    var rbody = $( "<div class='span6 reply'></div>" ).append( data.postBody ).hide().fadeIn( 2000 );
    $( '#' + data.parentID + ' .replyscontainer' ).append( rmeta, rbody );
}


// Build the full data-stream of posts
function buildStream(data) {
    // If we have no data - do nothing
    if (data.length === 0) {
        return null;
    }
    // Load the data into Javascript Objects
    data = JSON.parse(data);

    // Build out a post
    // Use generic classes and bootstrap dimensions so it scales on all resolutions
    for (i = 0; i < data.length; i++) {
        var postcontainer = $("<div class='span8 postcontainer' id=" + data[i].postID + "></div>");
        var title = $("<h3 class='hero-title'></h3>").append(data[i].postTitle);
        var meta = $("<h6></h6>").append(data[i].postDate + " - " + data[i].postedBy);
        var body = $("<div class='row12'></div>").append(data[i].postBody);

        var replys = $('<div class="span6 replyscontainer"></div>');

        for (j = 0; j < data[i].Replys.length; j++) {
            var rmeta = $("<h6></h6>").append(data[i].Replys[j].postDate + " - " + data[i].Replys[j].postedBy);
            var rbody = $("<div class='span6 reply'></div>").append(data[i].Replys[j].postBody);
            replys.append( rmeta, rbody );
        }


        $(postcontainer).append(title, meta, body, replys);
        // Since we are iterating through these posts in order - and oldest will come first
        // append the posts to the top of the parent container.
        $('#datastream').prepend(postcontainer);
    }
}

// Event to display the "click to add reply"
// simply shows an overlay arrow on the post title.

function bindReplyDisplay() 
{
    // Check the site wide cookie thats set after login
    // Do not display any of the front end elements when
    // they are not signed in. 
    if ($.cookie("Username") === null) 
    {
        return;
    }
    
    // When you mouse over, display the arrow by appending an icon to the element
    $('.postcontainer').mouseenter(function () {
        $(this).find(".hero-title").append('<i class="icon-share-alt"></i>');
    }).mouseleave(function () { // When you mouse out, remove the icon.
        $(this).find('.icon-share-alt').remove();
    });

    $( '.postcontainer' ).click( function ()
    {

        if ( last_key_pressed != null )
        {
            var last_key_pressed;
        }
        //console.log($(this).find('.replyscontainer').find('#ReplyBox').length); // Locate the current post's comment/reply container



        // Since the stupid ! operator wasnt workign as expected, hack it and do yoda notation
        // If it doesnt have one - do nothing.
        if ( $( '#ReplyBox' ).length <= 0 )
        {
            // ok, we're in the reply container. Display a textbox for the comment body
            if ( $( '.replyscontainer textarea' ).length <= 0 )
            {
                $( this ).find( '.replyscontainer' ).append( $( "<textarea></textarea>" ).attr( "id", "ReplyBox" ).height( "215px" ).width( "455px" ) );
                $( '.replyscontainer textarea' ).focus();


                // To keep the UI clean, dont use buttons.
                // This is an event binder, and it fires after the user
                // presses a key. 
                $( '#ReplyBox' ).keyup( function ( e )
                {
                    //Handy to have when binding key events and you want more than one keypress


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
        }
    } );
}

$('input[name=postBody]').keyUp(function(e) 
    {
      if ($('input[name=postTitle]').val().length >= 2 && $('input[name=postBody').val().length >= 5)
      {
        alert("ding!");
      }
    }

// Consider this the constructor - run on page load
$('document').ready(function () {
    // be persnickety - if the user is not logged in - dont show them any of the main interaction elements
    if ($.cookie("Username") === null) {
        $('#writerBox').hide();
    }

    // pull the posts via AJAX from the controller method
    getPosts();

    // Since this is based off of an ajax call - delay the event call, and bind after the ajax is complete.
    // by encasing the operation in an anonymous function, it works all the way down to IE6. bonus!
    window.setTimeout(
        function () {
            bindReplyDisplay();
        }, 1000);

});
