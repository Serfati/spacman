let score = 0,
    goal_score = 250;
let pac_color = "yellow",
    last_move = 1;
let time_left, interval;
let max_game_time = 800,
    number_of_balls = 50,
    total_ball_score;
const bonus_score = 50;
const bg_music_path = "assets/sound/ready.mp3",
    hit_sound_path = "assets/sound/die.mp3",
    cherry_sound_path = "assets/sound/eat-pill.mp3",
    win_sound_path = "assets/sound/coffee-break-music.mp3";
let bg_music_duration,
    bg_music = null,
    hit_sound = null,
    cherry_sound = null,
    win_sound = null;
let p5_balls, p15_balls, p25_balls;
let p5color, p15color, p25color;
let keyUp, KeyDown, keyLeft, keyRight;
const max_level = 10;
let level = 6;
let counter = 0,
    food_counter = 0,
    hearts = 4;
let number_of_ghost = 3;
$(document).ready(function () {
    hideAll();
    $("#container_game").hide();
    $("#logout_user").hide();
    $("#game_user").hide();
    $("#btn_play").hide();
    $("#welcome").show();
    function resize() {
        let size =
            $(window).height() -
            $("#canvas").offset().top -
            Math.abs($("#canvas").outerHeight(true) - $("#canvas").outerHeight());
        size *= 7 / 10;
        document.getElementById("canvas").height = size;
        document.getElementById("canvas").width = size;
        canvasWidth = document.getElementById("canvas").width;
        canvasHeight = document.getElementById("canvas").height;
        sprite_size = canvasWidth / board_size; //dynamically scale character size according to board size
        if (gameOver) {
            draw();
            if (hearts > 0) {
                if (score >= goal_score) {
                    var massage_to_draw = "We have a Winner!!!";
                    aletrtBox(
                        "#9b6161",
                        massage_to_draw,
                        getPixelSize(massage_to_draw)
                    );
                } else {
                    var massage_to_draw = "You can do better.. " + score;
                    aletrtBox(
                        "#9b6161",
                        massage_to_draw,
                        getPixelSize(massage_to_draw)
                    );
                }
            } else {
                var massage_to_draw = "You Lost!";
                aletrtBox(
                    "yellow",
                    massage_to_draw,
                    getPixelSize(massage_to_draw)
                );
            }
        }
    }

    resize();
    $(window).on("resize", function () {
        resize();
    });
    window.addEventListener(
        "keydown",
        function (e) {
            // space and arrow keys
            if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        },
        false
    );
    $("#re_game").click(function () {
        {
            window.clearInterval(interval);
            cold_start = true;
            get_bonus = false;
            poison_mode = false;
            clearTimeout(poison_timeout);
            gift_mode = false;
            clearTimeout(gift_timeout);
            gameOver = false;
            blue_ghost_shape = null;
            pink_ghost_shape = null;
            yellow_ghost_shape = null;
        }
        lblHeart.value = printHearts(hearts + 1);
        bg_music.pause();
        bg_music.currentTime = 0;
        gameOver = false;
        clearInterval(countDownTimer);
        time_left = max_game_time;
        Start();
    });
    $("#nav_game").click(function () {
        hideAll();
        $("#game").show();
        $("#container_pre_game").show();
        $("#container_game").hide();
        $("#ball_numm").val("50");
        $("#ghost_num").val("3");
        $("#game_time").val("60");
        $("#level_check").val("6");
        stopMusic();
        window.clearInterval(interval);
        window.clearInterval(countDownTimer);
    });
});

let click = $("#finish_pref").click(function () {
    const temp_ball_num = $("#ball_numm").val();
    if (temp_ball_num >= 50 && temp_ball_num <= 90)
        number_of_balls = temp_ball_num;
    else number_of_balls = 50;

    const temp_game_time = $("#game_time").val();
    if (temp_game_time >= 60 && temp_game_time <= 800)
        max_game_time = temp_game_time;
    else max_game_time = 60;

    const temp_ghost_num = $("#ghost_num").val();
    if (temp_ghost_num >= 1 && temp_ghost_num <= 4)
        number_of_ghost = temp_ghost_num;
    else number_of_ghost = 3;

    const temp_level = $("#level_check").val();
    if (temp_level >= 1 && temp_level <= 10) level = temp_level;
    else level = 6;

    p5color = $("#5points").val();

    p15color = $("#15points").val();

    p25color = $("#25points").val();

    const key_up = $("#key_up").keypress(function (e) {
        if (e.which === "38") {
            keyUp = 38;
        } else keyUp = this.value;
    });
    const key_down = $("#key_down").keypress(function (e) {
        if (e.which === "40") {
            keyDown = 40;
        } else keyDown = this.value;
    });
    const key_right = $("#key_right").keypress(function (e) {
        if (e.which === "39") {
            keyRight = 39;
        } else keyRight = this.value;
    });
    const key_left = $("#key_left").keypress(function (e) {
        if (e.which === "37") {
            keyLeft = 37;
        } else keyLeft = this.value;
    });
    $("#container_pre_game").hide();
    $("#container_game").show();
    blue_ghost_shape = null;
    pink_ghost_shape = null;
    yellow_ghost_shape = null;
    Start();
});

function initRandomColor() {
    const suffix = "0123456789ABCDEF";
    let tag = "#";
    for (let i = 0; i < 6; i++) {
        tag += suffix[Math.floor(Math.random() * 16)];
    }
    return tag;
}

$("#random").click(function () {
    $("#game_time").val(Math.floor(Math.random() * 100 + 60));
    $("#ball_numm").val(Math.floor(Math.random() * 40 + 50));
    $("#ghost_num").val(Math.floor(Math.random() * 4 + 1));
    $("#level_check").val(Math.floor(Math.random() * 10 + 1));
    $("#5points").val(initRandomColor());
    $("#15points").val(initRandomColor());
    $("#25points").val(initRandomColor());
    alert("Random Settings Generated!");
});

function setBallNumbers() {
    p5_balls = Math.floor(number_of_balls * 0.6);
    p15_balls = Math.floor(number_of_balls * 0.3);
    p25_balls = number_of_balls - p5_balls - p15_balls;
    total_ball_score = p5_balls * 5 + p15_balls * 15 + p25_balls * 25;
}

function stopMusic() {
    if (null !== bg_music) {
        bg_music.pause();
        bg_music.currentTime = 0;
    }
}

function setMusic() {
    bg_music = document.createElement("audio");
    bg_music.setAttribute("src", bg_music_path);
    bg_music_duration = bg_music.duration;
    bg_music.volume = 0.2;

    hit_sound = document.createElement("audio");
    hit_sound.setAttribute("src", hit_sound_path);

    cherry_sound = document.createElement("audio");
    cherry_sound.setAttribute("src", cherry_sound_path);

    win_sound = document.createElement("audio");
    win_sound.setAttribute("src", win_sound_path);

    bg_music.addEventListener(
        "ended",
        function () {
            this.currentTime = 0;
            this.play();
        },
        false
    );
}