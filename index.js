$(document).ready(function() {

    const controls = $('#time, #start, #stop, #resume, #pause');
    const change_time = $('#Bm, #Bp, #Lm, #Lp');

    var TIME = $('#time');
    var START = $('#start');
    var PAUSE = $('#pause');
    var RESUME = $('#resume');
    var STOP = $('#stop');

    var Running = false;

    $('#stop, #pause, #resume').hide();

    var time_length = $('#length-time').text();
    TIME.html(`<p id='time'>${time_length}</p>`);


    controls.click(function() {

        var input = $(this).attr("id");

        var session = Number($('#length-time').text()) * 60000;
        console.log(`session: ${session}`);

        switch (input) {
            case "start":
                countdown.Start(session);
                break;
            case "pause":
                console.log("pause");
                countdown.Pause();
                break;
            case "resume":
                console.log("resume");
                countdown.Resume();
                break;
            case "stop":
                console.log("stop");
                countdown.Stop();
                break;
        }

    });

    change_time.click(function(){

        //checks if the Clock is running, if it is, returns (prevents time change);
        var inquire = Running;
        console.log(inquire);
        if (inquire === true){
            return;
        }

        var id = $(this).attr('id');

        if (id === "Bp" || id === "Bm"){
            var target = '#break-time';
        }

        if (id === "Lp" || id === "Lm"){
            var target = '#length-time';
        }

        var current = $(target).text();
        var input = $(this).text();

        changeTime(input, target, current);

        var newTime = $('#length-time').text();

        TIME.html(`<p id='time'>${newTime}</p>`);

    });

    function changeTime(input, target, current) {
        // user time change is limited to 1 and 60 mins
        if (current === "1" && input === "-" || current === "60" && input === "+") {
            return;
        }

        if (input === "+") {
            current++;
        }
        if (input === "-") {
            console.log('- is firing');
            current--;
        }

        $(target).html(`<span id=${target}>${current}</span>`);

    }

    var countdown = (function($) {

        var is_stopwatch = false;

        var TimeOut = 10000;
        var TimeGap = 1000;

        var CurrentTime = new Date().getTime();
        var EndTime = new Date().getTime() + TimeOut;

        Running = false; //changed this

        var TimeDisplay = $("#time");

        var UpdateTimer = function() {
            if (CurrentTime + TimeGap < EndTime) {
                setTimeout(UpdateTimer, TimeGap);
            }
            // Countdown if running
            if (Running) {
                CurrentTime += TimeGap;
                if (CurrentTime >= EndTime) {
                    if (is_stopwatch === true){
                        countdown.Break( Number( $('#break-time').text()) * 60000);
                    }
                    else {
                        countdown.Start( Number($('#length-time').text()) * 60000 );
                    }
                    // $("<p id='time'>Done</p>").replaceAll(TimeDisplay);
                    // start break
                }
            }

            var Time = new Date();
            Time.setTime(EndTime - CurrentTime);
            var Minutes = Time.getMinutes();
            var Seconds = Time.getSeconds();
            TimeDisplay.html(
                (Minutes < 10 ? "0" : "") +
                Minutes +
                ":" +
                (Seconds < 10 ? "0" : "") +
                Seconds
            );
        };

        var Start = function(time) {

            is_stopwatch = true;

            $('#watch').html('<p id="watch">Session</p>');
            Running = true;
            TimeOut = time;
            CurrentTime = new Date().getTime();
            EndTime = new Date().getTime() + TimeOut;

            UpdateTimer();

            STOP.show();
            START.hide();
            PAUSE.show();

        };

        var Pause = function() {

            Running = false;

            RESUME.show();
            PAUSE.hide();

        };

        var Resume = function() {

            Running = true;

            PAUSE.show();
            RESUME.hide();

        };

        var Stop = function() {

            Running = false;

            START.show();
            RESUME.hide();
            PAUSE.hide();
            STOP.hide();

            TimeOut = 0;
            CurrentTime = 0;
            EndTime = 0;

        };

        var Break = function(breaktime) {

            is_stopwatch = false;

            $('#watch').html('<p id="watch">Break</p>')

            Running = true;
            TimeOut = breaktime;
            CurrentTime = ( new Date() ).getTime();
            EndTime = ( new Date() ).getTime() + TimeOut;

            $('#start').hide();
            $('#resume').hide();
            $('#pause').hide();

            UpdateTimer();

        }

        return {
            Pause: Pause,
            Resume: Resume,
            Stop: Stop,
            Break: Break,
            Start: Start
        };
    })(jQuery);

    //   countdown.Start(25*60000);

    //   jQuery('#resume').on('click', countdown.Resume);
    //   jQuery('#pause').on('click', countdown.Pause);
    //   jQuery('#stop').on('click', countdown.Stop);
});
