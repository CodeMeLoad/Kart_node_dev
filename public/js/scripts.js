var rtime = new Date(1, 1, 2000, 12, 00, 00),
            timeout = false,
            delta = 50;
var $contentwrapper;
$(document).ready(function () {
    loaded = true;
    $contentwrapper = $('#contentwrapper');
    var lineHeight = parseInt($(document.getElementsByClassName('content')[0]).css('line-height'));
    $(window).bind('orientationchange resize', function () {
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            window.setTimeout(readyrespond, delta);
        }
    });
    respond(false);
    $contentwrapper.niceScroll();
    constantOffset = $contentwrapper.position().top - $('#contentblock').position().top - $('#topbar').outerHeight();
    $(function () {
        $('a[href*=#]:not([href=#])').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                dist = target.position().top + $contentwrapper.scrollTop() + constantOffset-5
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
    if ($.mosaicflow)
        $('#gallery').mosaicflow();
    waypointInit(sections);
});
function waypointInit(n,$target) 
{
    if (!n)
        return;
    $target = $target == undefined ? $('.contentpane-full,.contentpane-full-sub') : $target;
    $target.waypoint(
        {
            handler:
                function (direction) 
                {
                    if ($(this).hasClass('nohide'))
                        return;
                    if (direction === 'down')
                    {
                        $(this).animate({ 'opacity': '0' }, 700);
                    }
                    else 
                    {
                        $(this).animate({ 'opacity': '1' }, 700);
                    }
                },
            context: '#contentwrapper',
            offset: function () {
                return (2.5 * parseInt($('.content').css('line-height')) - $(this).outerHeight());
            }
        });
    $target.waypoint(
        {
            handler:
                function (direction)
                {
                    if ($(this).hasClass('nohide'))
                        return;
                        if (direction === 'down') {
                            $(this).animate({ 'opacity': '1' }, 700);
                        }

                        else {
                            $(this).animate({ 'opacity': '0' }, 700);
                        }
                    },
                context: '#contentwrapper',
                offset: '90%'
            });
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
function readyrespond() {
    if (new Date() - rtime < delta) {
        setTimeout(readyrespond, delta);
    }
    else {
        timeout = false;
        respond(true);
    }
}