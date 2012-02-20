

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


// Build the full data-stream of posts
function buildStream(data) {
    // If we have no data - do nothing
    if (data.length === 0) {
        return null;
    }

    data = JSON.parse(data);

    // Build out a 
    for (i = 0; i < data.length; i++) {
        var postcontainer = $("<div class='span8 postcontainer' id=" + data[i].postID + "></div>");
        var title = $("<h3 class='hero-title'></h3>").append(data[i].postTitle);
        var meta = $("<h6></h6>").append(data[i].postDate + " - " + data[i].postedBy);
        var body = $("<div class='row12'></div>").append(data[i].postBody);

        var replys = $('<div class="span6 replyscontainer"></div>');

        for (j = 0; j < data[i].Replys.length; j++) {
            var rmeta = $("<h6></h6>").append(data[i].Replys[j].postDate + " - " + data[i].Replys[j].postedBy);
            var rbody = $("<div class='span6 reply'></div>").append(data[i].Replys[j].postBody);
            replys.append(rmeta, rbody);
        }


        $(postcontainer).append(title, meta, body, replys);

        $('#datastream').prepend(postcontainer);
    }
}

// Event to display the "click to add reply"
function bindReplyDisplay() {
    if ($.cookie("Username") === null) {
        return;
    }

    $('.postcontainer').mouseenter(function () {
        $(this).find(".hero-title").append('<i class="icon-share-alt"></i>');
    }).mouseleave(function () {
        $(this).find('.icon-share-alt').remove();
    });


}


// Consider this the constructor - run on page load
$('document').ready(function () {
    // be persnickety - if the user is not logged in - dont show them the writer box
    if ($.cookie("Username") === null) {
        $('#writerBox').hide();
    }

    getPosts();

    // Since this is based off of an ajax call - delay the event call, and bind after the ajax is complete.
    // by encasing the operation in an anonymous function, it works all the way down to IE6. bonus!
    window.setTimeout(
        function () {
            bindReplyDisplay();
        }, 1000);

});