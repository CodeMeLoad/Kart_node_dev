var rtime = new Date(1, 1, 2000, 12, 00, 00),
            timeout = false,
            delta = 0;
var $contentwrapper;
$(document).ready(function () {
    loaded = true;
    $contentwrapper = $('#contentwrapper');
    var lineHeight = parseInt($(document.getElementsByClassName('content')[0]).css('line-height'));
    $(window).bind('orientationchange resize', function () { respond(true) });
    respond(false);
    if ($.mosaicflow)
        $('#gallery').mosaicflow();
    waypointInit(sections);
    constantOffset = $contentwrapper.position().top - $('#contentblock').position().top - $('#topbar').outerHeight();
    $(function () {
        $('a[href*=#]:not([href=#])').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                dist = target.position().top + $contentwrapper.scrollTop() + constantOffset
                if (target.length && dist) {
                    $contentwrapper.animate(
                        {
                            scrollTop: dist
                        }, 500);
                }
                if (target.length) {
                    return false;
                }
            }
        });
    });
});
function waypointInit(n,$target) 
{
    if (!n)
        return;
    $target = $target == undefined ? $('.contentpane-full,.contentpane-full-sub') : $target;
    $target.waypoint(
            {
                handler:
                    function (direction) {
                        $('.active').removeClass('active');
                        if (direction === 'up') {
                            $('#ls' + ($(this).attr('id')[1] - 1)).addClass('active');
                        }

                        else {
                            $('#l' + $(this).attr('id')).addClass('active');
                        }
                    },
                context: '#contentwrapper',
                offset: '50%'
            });
}
function waypointDestroy(n,$target)
{
    if (!n)
        return;
    $target = $target == undefined ? $('.contentpane-full,.contentpane-full-sub') : $target;
    $target.waypoint('destroy');
}
function respond(t) {
    $contentwrapper.css('height', ($('html').outerHeight() - $('#topbar').outerHeight()) + 'px');
    if (t)
    {
        waypointDestroy(sections);
        waypointInit(sections);
    }
}