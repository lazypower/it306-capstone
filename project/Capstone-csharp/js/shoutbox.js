$('#icon').click(function () {
    var stuff = $(this).attr('rel');
    var speed = 500;

    if (stuff == "0") {
        $('#main').stop().animate({ 'left': '40%' }, speed);
        $('#sbcontent').stop().animate({ 'right': '0px' }, speed);
        $('#sbicon').stop().animate({ 'right': '305px' }, speed);
        $(this).attr('rel', '1');
    } else {
        $('#main').stop().animate({ 'left': '50%' }, speed);
        $('#sbcontent').stop().animate({ 'right': '-305px' }, speed);
        $('#sbicon').stop().animate({ 'right': '0px' }, speed);
        $(this).attr('rel', '0');
    }
});