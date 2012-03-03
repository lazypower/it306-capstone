

function ReadPostResponse(serviceResponse) {
    
    // no fair cheating, we need a response object instance
    if (serviceResponse === "undefined")
        return;

    if (serviceResponse.code === "undefined")
        return
    else {
        switch (serviceResponse.code) {
            case "1":
                alert(serviceResponse.payload);
                break;
            case "2":
                window.location.href = serviceResponse.payload;
                break;
            case "3":
                // service is unavailable - see wiki
                alert('Service Unavailable!');
            default:
                // see case 3
                alert('Unrecognized response!');
                break;
        }
    }
}

function checkResponse(data) {
    var msg = eval(data);
    // if it has the asp.net .d - negate it
    if (msg.hasOwnProperty('d'))
        return msg.d;
    else
        return msg;
}

var urlParams = {};
	(function () {
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.search.substring(1);

    while (e = r.exec(q))
       urlParams[d(e[1])] = d(e[2]);
	})();

$('#sub1').click(function(){
 $('#content1').show();
 $('#sub1').removeClass('lighter').addClass('darker');
 $('#content2').hide();
 $('#sub2').removeClass('darker').addClass('lighter');
 $('#content3').hide();
 $('#sub3').removeClass('darker').addClass('lighter');
 return false;
});

$('#sub2').click(function(){
 $('#content1').hide();
 $('#sub1').removeClass('darker').addClass('lighter');
 $('#content2').show();
 $('#sub2').removeClass('lighter').addClass('darker');
 $('#content3').hide();
 $('#sub3').removeClass('darker').addClass('lighter');
 return false;
});

$('#sub3').click(function(){
 $('#content1').hide();
 $('#sub1').removeClass('darker').addClass('lighter');
 $('#content2').hide();
 $('#sub2').removeClass('darker').addClass('lighter');
 $('#content3').show();
 $('#sub3').removeClass('lighter').addClass('darker');
 return false;
});

$(function(){
    //original field values
    var field_values = {
            //id        :  value
            'username'  : 'username',
            'password'  : 'password',
            'cpassword' : 'password',
            'firstname'  : 'first name',
            'lastname'  : 'last name',
            'email'  : 'email address'
    };


    //inputfocus
    $('input#username').inputfocus({ value: field_values['username'] });
    $('input#password').inputfocus({ value: field_values['password'] });
    $('input#cpassword').inputfocus({ value: field_values['cpassword'] }); 
    $('input#lastname').inputfocus({ value: field_values['lastname'] });
    $('input#firstname').inputfocus({ value: field_values['firstname'] });
    $('input#email').inputfocus({ value: field_values['email'] }); 


    //Regex's for Validation
        // set the regular expressions for input validation
    var nameRegex = new RegExp("^[A-Za-z][a-zA-Z]*$");
	var zipRegex = new RegExp("\\d{5}(-\\d{4})?");
	var phoneRegex = new RegExp(/^[01]?[- .]?\(?[2-9]\d{2}\)?[- .]?\d{3}[- .]?\d{4}$/);
	var emailRegex = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);


    //first_step
    $('form').submit(function(){ return false; });
    $('#submit_first').click(function(){
        //remove classes
        $('#first_step input, #first_step select').removeClass('error').removeClass('valid');
        //check if inputs aren't empty
        var fields = $('#first_step input[type=text], #first_step input[type=password]');
        var error = 0;
        fields.each(function(){
            var value = $(this).val();
            if( value.length<2 || value==field_values[$(this).attr('id')] ) {
                $(this).addClass('error');
                $(this).effect("shake", { times:3 }, 50);
                
                error++;
            } else {
                $(this).addClass('valid');
            }
        });
		
		var field = $('#first_step select');
		field.each(function(){
			if($(this).val() == "0"){
					$(this).addClass('error');
					$(this).effect("shake", { times:3 }, 50);
                
					error++;
				} else {
					$(this).addClass('valid');
				}
		});
		
		$(function(){
		if($('input[name=agree_terms]:checked').size() == 0)
		{
			$('input[name=agree_terms]').parent().addClass('error');
			error++;
		}
		else
		{
			$('input[name=agree_terms]').parent().addClass('valid');
		}
		});
		
		$(function(){
		if($('input[name=agree_privacy]:checked').size() == 0)
		{
			$('input[name=agree_privacy]').parent().addClass('error');
			error++;
		}
		else
		{
			$('input[name=agree_privacy]').parent().addClass('valid');
		}
		});

		
        if(!error) {
            if(nameRegex.test($('input[name=NameFirst]').val()) == false ) {
                    $('input[name=NameFirst]').removeClass('valid').addClass('error').effect("shake", { times:3 }, 50);                                     
                    return false;
					}
			else if(nameRegex.test($('input[name=NameLast]').val()) == false ) {
                    $('input[name=NameLast]').removeClass('valid').addClass('error').effect("shake", { times:3 }, 50);                                     
                    return false;
					}
			else if(zipRegex.test($('input[name=AddressZip]').val()) == false ) {
                    $('input[name=AddressZip]').removeClass('valid').addClass('error').effect("shake", { times:3 }, 50);                                     
                    return false;
					}
			else if(emailRegex.test($('input[name=EmailAddress]').val()) == false ) {
                    $('input[name=EmailAddress]').removeClass('valid').addClass('error').effect("shake", { times:3 }, 50);                                     
                    return false;
					}
			else if(phoneRegex.test($('input[name=HomePhone]').val()) == false ) {
                    $('input[name=HomePhone]').removeClass('valid').addClass('error').effect("shake", { times:3 }, 50);                                     
                    return false;
					}
			else {
			
				//prepare the fourth step
				var fields = new Array(
				$('#username').val(),
				$('#password').val(),
				$('#email').val(),
				$('#firstname').val() + ' ' + $('#lastname').val(),
				$('#age').val(),
				$('#gender').val(),
				$('#country').val()                       
				);
				var tr = $('#fourth_step tr');
				tr.each(function(){
				//alert( fields[$(this).index()] )
				$(this).children('td:nth-child(2)').html(fields[$(this).index()]);
				});
              
			   //Posting via the Drew system's method
				var LeadData = new Object();
				jQuery('input').each(function () {
					LeadData[$(this).attr('name')] = this.value;
				})
		
				jQuery('select').each(function() {
					LeadData[$(this).attr('name')] = this.value;
				})
                
				jQuery('hidden').each(function() {
					LeadData[$(this).attr('name')] = this.value;
				})


				// add in the URL Params
				for (var prop in urlParams) 
				{
					if (urlParams.hasOwnProperty(prop))
					{
						if (prop === 'vid') {
							LeadData['vid'] = urlParams[prop];
						}
						if (prop === 'vguid') {
							LeadData['VendorGuid'] = urlParams[prop];
						}
					}
				}

				var DTO = { 'lead': LeadData };
				// Staging
				//var theURL = "http://localhost:50274/ServiceTest.asmx/ProgramInput" // Sandbox
				var theURL;
				if (LeadData.hasOwnProperty("ProductCode")) {
					theURL = "http://" + window.location.host + "/ServiceTest.asmx/ProgramInput"; // Production
				} else if (LeadData.hasOwnProperty("pcat")) {
					theURL = "http://" + window.location.host + "/ServiceTest.asmx/CategoryInput"; // Production
				} else {
					theURL = "http://" + window.location.host + "/ServiceTest.asmx/AreaInput"; // Production
				}
			jQuery.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: theURL,
				data: JSON.stringify(DTO),
				dataType: "json",
				error: function (xhr, status, errorThrown) {
                alert(errorThrown + '\n' + status + '\n' + xhr.statusText);
				},
				success: function (data) {
					var dataObject = jQuery.parseJSON(data);
					ReadPostResponse(checkResponse(data));
				},
					failure: function (data) {
					alert("Failure: ");
				}
			}); // end of ajax call  
			  
			//change the progress bar image
			$('#progress').attr("src", "img/ProgressBar100.png")
			//slide steps       
			}
		
         } else return false;			
    });


    $('#submit_fourth').click(function(){
        //send information to server
        alert('Data sent');
    });
            
});
