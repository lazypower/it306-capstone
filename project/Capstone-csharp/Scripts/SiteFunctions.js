$('dropdown-toggle').dropdown();

//inline hack to fix the click event on dropdown when it contains a form
// Thank you stackoverflow 
$('.dropdown-menu').find('form').click(function (e) {
    e.stopPropagation();
});

// Script to remove the form if the user has logged in
if ($.cookie("Username") != null) {
    $('#Account-item1').children().remove();
    $('#AccountLeader').html($.cookie("Username") + " <b class='caret'></b> ");
    $('#Account-item1').append('<a href="/Account/ChangePassword">Change Password</a>');
    $('#Account-item1').append('<a href="/Account/Logoff">Log Out</a>');
}
        
       