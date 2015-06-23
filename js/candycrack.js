CandyCrack = function () {
    var self = this;
    self.INPUT = 'input';
    self.mode = self.INPUT;
    self.alertbox = $('#alertbox');

    self.getScore = function () {
        if (!$('#score').val())
            self.alertbox.html(generateAlert('warning', 'Please enter score!'));
        else
            endGame();
    }

    function endGame() {
        var secretKey = "BuFu6gBFv79BH9hk";
        var timeLeftPercent = -1;
        var episode = $('#episode').val();
        var level = $('#level').val();
        var score = $('#score').val();
        var session = $('#session').val();
        var user = $('#userid').val();
        var seed = $('#seed').val();

        var input = episode + ":" + level + ":" + score + ":" + timeLeftPercent + ":" + user + ":" + seed + ":" + secretKey;
        var cs = hash(input).substr(0, 6);
        $('#cs').attr('value', cs);

        self.alertbox.html(generateAlert('info', 'Completing Level...'));

        var data = {};
        data.cs = cs;
        data.seed = seed;
        data.reason = 0;
        data.timeLeftPercent = -1;
        data.score = score;
        data.levelId = level;
        data.episodeId = episode;

        var url = "http://candycrush.king.com/api/gameEnd";
        var params = {};
        params.arg0 = JSON.stringify(data);
        params._session = session;

        $.get(url, params, function (data) {
            self.alertbox.html(JSON.stringify(data));
        }).done(function() {
            self.alertbox.html(generateAlert('success', 'Level successfully completed!'));
        }).fail(function() {
            self.alertbox.html(generateAlert('danger', 'Oops! Something went wrong!'));
        });
    }

    function hash(input) {
        return $.md5(input);
    }

    function generateAlert(alertClass, text) {
        return '<div class="alert alert-' + alertClass + ' alert-dismissible" role="alert">' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            text + '</div>';
    }

    self.validateNumber = function (evt) {
        var e = evt || window.event;
        var key = e.keyCode || e.which;

        if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
            // numbers
            key >= 48 && key <= 57 ||
            // Numeric keypad
            key >= 96 && key <= 105 ||
            // Backspace and Tab and Enter
            key == 8 || key == 9 || key == 13 ||
            // Home and End
            key == 35 || key == 36 ||
            // left and right arrows
            key == 37 || key == 39 ||
            // Del and Ins
            key == 46 || key == 45) {
                // input is VALID
        } else {
            // input is INVALID
            e.returnValue = false;
            if (e.preventDefault) e.preventDefault();
        }
    }

    self.hack = function () {
        if (!$('#session').val()) {
            self.alertbox.html(generateAlert('warning', 'Please input the session key'));
            return;
        }

        if (!$('#episode').val()) {
            self.alertbox.html(generateAlert('warning', 'Please input an episode'));
            return;
        }

        if (!$('#level').val()) {
            self.alertbox.html(generateAlert('warning', 'Please input a level'));
            return;
        }

        self.getScore();
    }
}

var candyCrack = new CandyCrack();

$(document).ready(function () {
    $('#alertbox').html('');

    $('#episode').keydown(function (e) {
        candyCrack.validateNumber(e);
    });

    $('#level').keydown(function (e) {
        candyCrack.validateNumber(e);
    });

    $('#score').keydown(function (e) {
        candyCrack.validateNumber(e);
    });

    $('#completeLevelButton').click(function () {
        candyCrack.hack();
    });

    $("input[name='scoreBy']").change(function (e) {
        candyCrack.mode = candyCrack.INPUT;
    });
});



