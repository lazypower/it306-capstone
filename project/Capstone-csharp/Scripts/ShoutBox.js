
$('document').ready(function()
{
	initShoutBox();
});

/* =====================================================
 * page initializer
 * ====================================================*/

function initShoutBox()
{
	// if we dont have any data - do an ajax poll
	if (ShoutData.length <= 0)
	{
		// do ajax
	}
	else
	{
		processInitialShouts();
	}

	// setup the HTTP Keepalive request
	// run it for one hour - grabbing posts every 5 seconds
		setInterval(function() {
			getShouts();
		}, 5000);

		
}

/*====================================================
 * AJAX Methods
 * ==================================================*/

function postShout(shout)
{
    $.ajax( {
        url: "/shoutbox/createShout",
        type: "POST",
        data:  "shoutMessage=" + shout.shoutString
    } ).done( function ( data )
    {
			console.log("Done!");
    } );

}

function getShouts()
{
    $.ajax({
        url: "/shoutbox/readShout",
        context: document.body,
        success: function (data) {
          CacheShouts(data);
        }
    });
}


/* ===================================================
 * Build Shout to insert into the Shoutbox
 * ==================================================*/

function processInitialShouts()
{
	for(var i = 0; i < ShoutData.length; ++i)
	{
		$('#chatbox').append(buildShout(ShoutData[i]));
	}
}

function buildShout(shout)
{
	var thisShout = $('<span></span>').addClass('shout');
	$(thisShout).html('<h6>' + shout.userID + '</h6><span>' + shout.shoutString + '</span>');
	return thisShout;
}


/* ==================================================
 *  Bind shoutbox Action Events
 *  ================================================*/
$('#chatboxinput textarea').keyup(function(e)
{
	var shoutText = $('#chatboxinput textarea').val();

	if (e.keyCode === 13 && shoutText.length > 1)
	{
		var shout = new Object();
		shout.userID = $.cookie("Username");
		shout.shoutString = shoutText; 
		
		postShout(shout);
		
		// this was causing duplication - let the ajax call build it
		//$('#chatbox').append(buildShout(shout));
		$('#chatboxinput textarea').val('');
	}


});

/* ==================================================
 * Caching operation for quick comparison
 * =================================================*/

function CacheShouts(Data)
{
	if(localStorage)
	{
		//before we append the data to LocalStorage --
		// check if theres a mis match, if so, we should append whats not there to the shoutbox.
		checkIfNewShouts(Data);			
		
		// its important to strigify the data
		localStorage.setItem("shoutBox", JSON.stringify(Data));
		
	}
}

function checkIfNewShouts(data)
{
	if (localStorage)
	{
		
		if(localStorage.getItem("shoutBox") != null)
		{
		var cachedData = JSON.parse(localStorage.getItem("shoutBox"));
	  
			for(var i = 0; i < cachedData.length; ++i)
			{
				if (cachedData.length != data.length || cachedData[i].shoutstring != data[i].shoutstring)
				{
					updateChat(data, cachedData);
					break;
				}
			}
		}
	}
}

// Compares local storage with intermediate data
// appends the mismatched items into the chatbox
function updateChat(data, cachedData)
{
	var shouts = jOrder(cachedData).index('cachedData', ['shoutString']);	
  console.log(shouts);

	for (var i = 0; i < data.length; ++i)
	{
		var count = shouts.where([{ shoutString : data[i].shoutString}]);
		if ( count.length === 0)
		{
			var shout = new Object();
			shout.userID = data[i].userID;
			shout.shoutString = data[i].shoutString;

			$('#chatbox').append(buildShout(shout));
		}
	}
}
