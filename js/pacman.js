const context = canvas.getContext("2d");
const direction = {up: 1, down: 2, left: 3, right: 4};
const actors = {
    nothing: 0,
    food: 1,
    pacMan: 2,
    obstacles: 4,
    red: 5,
    blue: 6,
    pink: 7,
    yellow: 8,
    moving_food: 8,
    poison: 9,
    gift: 10,
    p5_ball: 11,
    p15_ball: 12,
    p25_ball: 13,
};
let get_bonus = false,
    poison_mode = false,
    poison_timeout,
    gift_mode = false,
    gift_timeout,
    countDownTimer,
    cold_start = true;
const board_size = 20;
let sprite_size = 60,
    canvasWidth,
    canvasHeight;
let board, dark_side_board;
let gameOver = false;
let pac_man_shape = {};


function getPixelSize(message) {
    const pixelWithCanvas = document.getElementById("canvas").width / 60;
    let pixelSize = "";
    if (message.length <= 10) pixelSize = pixelWithCanvas * 3;
    else if (message.length <= 20) pixelSize = pixelWithCanvas * 2;
    else if (message.length > 15) pixelSize = pixelWithCanvas * 1;
    pixelSize += "px";
    return pixelSize;
}

function Start() {
    time_left = max_game_time;
    score = 0;
    counter = 0;
    hearts = 4;
    lblHeart.value = printHearts(hearts + 1);
    setBallNumbers();
    canvasWidth = document.getElementById("canvas").width;
    canvasHeight = document.getElementById("canvas").height;
    sprite_size = canvasWidth / board_size; //dynamically scale character size according to board size
    board = []; // create dynamic array
    dark_side_board = [];
    for (var i = 0; i < board_size; i++) {
        board[i] = [];
        dark_side_board[i] = [];
        for (let j = 0; j < board_size; j++) {
            board[i][j] = actors.nothing;
            dark_side_board[i][j] = actors.nothing;
        }
    }
    const x = Math.random();
    map1(board, dark_side_board);
    putGhosts();
    for (var i = p5_balls; i > 0; i--) {
        var emptyCell = findRandomEmptyCell(board), x_cell = emptyCell[0], y_cell = emptyCell[1];
        board[x_cell][y_cell] = actors.p5_ball;
    }
    for (i = p15_balls; i > 0; i--) {
        emptyCell = findRandomEmptyCell(board);
        x_cell = emptyCell[0];
        y_cell = emptyCell[1];
        board[x_cell][y_cell] = actors.p15_ball;
    }
    for (i = p25_balls; i > 0; i--) {
        emptyCell = findRandomEmptyCell(board);
        x_cell = emptyCell[0];
        y_cell = emptyCell[1];
        board[x_cell][y_cell] = actors.p25_ball;
    }
    insertPacMan();
    var emptyCell = findRandomEmptyCell(board), x_cell = emptyCell[0], y_cell = emptyCell[1];
    board[x_cell][y_cell] = actors.poison;



    gameOver = false;
    cold_start = true;
    keysDown = {};
    addEventListener(
        "keydown",
        function (e) {
            keysDown[e.keyCode] = true;
        },
        false
    );
    addEventListener(
        "keyup",
        function (e) {
            keysDown[e.keyCode] = false;
        },
        false
    );
    draw();
    interval = setInterval(updatePosition, 100); //The main loop that plays the game
    setMusic();
    bg_music.play(); //begin playing theme song
    lblTime.value = printTime(time_left);
    lblScore.value = score;
    countDownTimer = setInterval(countDown, 1000);
    clearInterval(countDownTimer);
}

function updatePosition() {
    let message_to_draw;
    board[pac_man_shape.i][pac_man_shape.j] = actors.nothing;
    const x = getKeyPressed();
    updatePacman(x);

    if (cold_start && x !== 0) {
        cold_start = false;
        countDownTimer = setInterval(countDown, 1000);
    } else if (cold_start) {
        message_to_draw = "Press a directional arrow to begin";
        aletrtBox("#9b6161", message_to_draw, getPixelSize(message_to_draw));
    } else {
        if (board[pac_man_shape.i][pac_man_shape.j] === actors.p5_ball) score += 5;
        if (board[pac_man_shape.i][pac_man_shape.j] === actors.p15_ball)
            score += 15;
        if (board[pac_man_shape.i][pac_man_shape.j] === actors.p25_ball)
            score += 25;
        if (
            board[pac_man_shape.i][pac_man_shape.j] < 4 ||
            board[pac_man_shape.i][pac_man_shape.j] > 10
        ) {
            board[pac_man_shape.i][pac_man_shape.j] = actors.pacMan;
        }

        if (board[pac_man_shape.i][pac_man_shape.j] === actors.poison) {
            {
                cherry_sound.play();
                cherry_sound.currentTime = 0;
                poison_mode = true;
                pac_color = "purple";

                poison_timeout = setTimeout(function () {
                    poison_mode = false;
                    pac_color = "yellow";
                }, 5000);
            }
        }
        checkCollisions();

        if (!cold_start) {
            if (counter === max_level - level) {
                updateGhosts();
                counter = 0;

                if (!get_bonus)
                    if (food_counter === 1) {
                        {
                            min = Math.ceil(0);
                            max = Math.floor(options.length - 1);
                            const index = Math.floor(Math.random() * (max - min)) + min;
                        }
                        food_counter = 0;
                    } else food_counter = 1;

                checkCollisions();
            } else counter += 1;
        }
        if (!gameOver)
            if (score >= goal_score) {
                gameOver = true;
                lblScore.value = score;
                window.clearInterval(interval);
                window.clearInterval(countDownTimer);
                draw();
                stopMusic();
                win_sound.play();
                win_sound.currentTime = 0;
                message_to_draw = "We have a Winner!!!";
                aletrtBox(
                    "#9b6161",
                    message_to_draw,
                    getPixelSize(message_to_draw)
                );
            } else {
                draw();
            }
    }
}

function draw() {
    canvas["width"] = canvas.width; //clean board
    lblScore.value = score; //here we update the label score

    for (let i = 0; i < board_size; i++) {
        for (let j = 0; j < board_size; j++) {
            const center = {};
            center.x = i * sprite_size;
            center.y = j * sprite_size;

            if (board[i][j] === actors.p5_ball &&
                dark_side_board[i][j] === actors.nothing)
                insertFood(
                    center.x + sprite_size / 2,
                    center.y + sprite_size / 2,
                    actors.p5_ball
                );
            else if (
                board[i][j] === actors.p15_ball &&
                dark_side_board[i][j] === actors.nothing
            )
                insertFood(
                    center.x + sprite_size / 2,
                    center.y + sprite_size / 2,
                    actors.p15_ball
                );
            else if (
                board[i][j] === actors.p25_ball &&
                dark_side_board[i][j] === actors.nothing
            )
                insertFood(
                    center.x + sprite_size / 2,
                    center.y + sprite_size / 2,
                    actors.p25_ball
                );
            else if (board[i][j] === actors.poison)
                insertPill(center.x, center.y, "green");
            /* dark side board characters */
            if (dark_side_board[i][j] === actors.red)
                insertGhost(center.x, center.y, "red");
            else if (dark_side_board[i][j] === actors.blue)
                insertGhost(center.x, center.y, "blue");
            else if (dark_side_board[i][j] === actors.yellow)
                insertGhost(center.x, center.y, "yellow");
            else if (dark_side_board[i][j] === actors.pink)
                insertGhost(center.x, center.y, "pink");
            else if (dark_side_board[i][j] === actors.obstacles) {

                var c = document.getElementById("canvas");
                var ctx = c.getContext("2d");
                var img = new Image();
                img.src = "assets/images/wall.svg";
                ctx.drawImage(
                    img,
                    center.x + 3,
                    center.y,
                    0.9 * (canvasWidth / board_size),
                    0.9 * (canvasHeight / board_size)
                );
            }
            if (board[i][j] === actors.pacMan) {
                //draw the pac-man
                if (last_move === direction.up)
                    drawPacMan(
                        center.x,
                        center.y,
                        1.65 * Math.PI,
                        3.35 * Math.PI,
                        "black",
                        -sprite_size / 4,
                        sprite_size / 12
                    );
                else if (last_move === direction.down)
                    drawPacMan(
                        center.x,
                        center.y,
                        0.65 * Math.PI,
                        2.35 * Math.PI,
                        "black",
                        -sprite_size / 4,
                        sprite_size / 12
                    );
                else if (last_move === direction.left)
                    drawPacMan(
                        center.x,
                        center.y,
                        1.15 * Math.PI,
                        2.85 * Math.PI,
                        "black",
                        sprite_size / 12,
                        -sprite_size / 4
                    );
                //right
                else
                    drawPacMan(
                        center.x,
                        center.y,
                        0.15 * Math.PI,
                        1.85 * Math.PI,
                        "black",
                        sprite_size / 12,
                        -sprite_size / 4
                    );
            }
        }
    }
}

function Finish() {
    hit_sound.play();
    if (hearts !== 0 && time_left > 0) {
        {
            cold_start = true;
            gameOver = false;
            poison_mode = false;
            clearTimeout(poison_timeout);
            pac_color = "yellow";
            dark_side_board[red_ghost_shape.i][red_ghost_shape.j] = actors.nothing;
            dark_side_board[moving_food_shape.i][moving_food_shape.j] = actors.nothing;

            if (number_of_ghost >= 2)
                dark_side_board[blue_ghost_shape.i][blue_ghost_shape.j] = actors.nothing;

            if (number_of_ghost >= 3)
                dark_side_board[pink_ghost_shape.i][pink_ghost_shape.j] = actors.nothing;

            if (number_of_ghost >= 4)
                dark_side_board[yellow_ghost_shape.i][yellow_ghost_shape.j] =
                    actors.nothing;
            putGhosts();
            board[pac_man_shape.i][pac_man_shape.j] = actors.nothing;
            insertPacMan();
            window.clearInterval(countDownTimer);
        }
        hearts -= 1;
        lblHeart.value = printHearts(hearts + 1);
    } else {
        stopMusic();
        gameOver = true;
        window.clearInterval(countDownTimer);
        window.clearInterval(interval);
        window.clearInterval(poison_timeout);
        window.clearInterval(gift_timeout);
        lblHeart.value = printHearts(0);
        if (hearts === 0) {
            var message_to_draw = "You Lost!";
            aletrtBox("#9b6161", message_to_draw, getPixelSize(message_to_draw));
        } else if (score <= goal_score) {
            var message_to_draw = "You can do better.." + score;
            aletrtBox("#9b6161", message_to_draw, getPixelSize(message_to_draw));
        }
    }
    hit_sound.currentTime = 0;
}

function updatePacman(x) {
    if (x === direction.up) {
        if (
            pac_man_shape.j > 0 &&
            board[pac_man_shape.i][pac_man_shape.j - 1] !== actors.obstacles
        ) {
            pac_man_shape.j--;
        }
        last_move = direction.up;
    } else if (x === direction.down) {
        if (
            pac_man_shape.j < board_size - 1 &&
            board[pac_man_shape.i][pac_man_shape.j + 1] !== actors.obstacles
        ) {
            pac_man_shape.j++;
        }
        last_move = direction.down;
    } else if (x === direction.left) {
        if (
            pac_man_shape.i > 0 &&
            board[pac_man_shape.i - 1][pac_man_shape.j] !== actors.obstacles
        ) {
            pac_man_shape.i--;
        }
        last_move = direction.left;
    } else if (x === direction.right) {
        if (
            pac_man_shape.i < board_size - 1 &&
            board[pac_man_shape.i + 1][pac_man_shape.j] !== actors.obstacles
        ) {
            pac_man_shape.i++;
        }
        last_move = direction.right;
    }
}

function insertPacMan() {
    let emptyCell;
    let redDist = 0,
        blueDist = 0,
        pinkDist = 0;
    yellowDist = 0;

    while (redDist < 3 || blueDist < 3 || pinkDist < 3 || yellowDist < 3) {
        emptyCell = findRandomEmptyCell(board);
        redDist = manhattanDistance(
            red_ghost_shape.i,
            red_ghost_shape.j,
            emptyCell[0],
            emptyCell[1]
        );
        if (number_of_ghost > 1)
            blueDist = manhattanDistance(
                blue_ghost_shape.i,
                blue_ghost_shape.i,
                emptyCell[0],
                emptyCell[1]
            );
        else blueDist = 4;
        if (number_of_ghost > 2)
            pinkDist = manhattanDistance(
                pink_ghost_shape.i,
                pink_ghost_shape.j,
                emptyCell[0],
                emptyCell[1]
            );
        else pinkDist = 4;
        if (number_of_ghost > 3)
            yellowDist = manhattanDistance(
                yellow_ghost_shape.i,
                yellow_ghost_shape.j,
                emptyCell[0],
                emptyCell[1]
            );
        else yellowDist = 4;
    }

    const x_cell = emptyCell[0];
    const y_cell = emptyCell[1];
    board[x_cell][y_cell] = actors.pacMan;
    pac_man_shape.i = x_cell;
    pac_man_shape.j = y_cell;
}

function countDown() {
    time_left--;
    lblTime.value = printTime(time_left); //here we update the lable time
    if (time_left <= 0) {
        Finish();
    }
}

function findRandomEmptyCell(board) {
    let i = Math.floor(Math.random() * board_size);
    let j = Math.floor(Math.random() * board_size);
    while (
        board[i][j] !== actors.nothing ||
        dark_side_board[i][j] !== actors.nothing
        ) {
        i = Math.floor(Math.random() * board_size);
        j = Math.floor(Math.random() * board_size);
    }
    return [i, j];
}

function getKeyPressed() {
    if (keysDown[38])
        if (poison_mode) return 2;
        else {
            return 1;
        }
    if (keysDown[40])
        if (poison_mode) return 1;
        else {
            return 2;
        }
    if (keysDown[37])
        if (poison_mode) return 4;
        else {
            return 3;
        }
    if (keysDown[39])
        if (poison_mode) return 3;
        else {
            return 4;
        }
    return 0;
}

function drawPacMan(x_value, y_value, start_angle, end_angle, color, eye_x, eye_y) {
    x_value += sprite_size / 2;
    y_value += sprite_size / 2;
    context.beginPath();
    context.arc(x_value, y_value, sprite_size / 2, start_angle, end_angle); // half circle
    context.lineTo(x_value, y_value);
    context.fillStyle = pac_color; //color
    context.fill();
    context.beginPath();
    context.arc(
        x_value + eye_x,
        y_value + eye_y,
        sprite_size / 12,
        0,
        2 * Math.PI
    ); // circle
    context.fillStyle = color; //color
    context.fill();
}

function insertPill(x_center, y_center, color) {
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");
    const img = new Image();
    img.src = "assets/images/" + color + "_pill.svg";
    ctx.drawImage(
        img,
        x_center,
        y_center,
        0.7 * (canvasWidth / board_size),
        0.7 * (canvasHeight / board_size)
    );
}

function insertFood(x_center, y_center, type) {
    context.beginPath();
    context.arc(x_center, y_center, sprite_size / 5, 0, 2 * Math.PI); // circle
    if (type === actors.p5_ball) {
        context.fillStyle = p5color; //color
    }
    if (type === actors.p15_ball) {
        context.fillStyle = p15color; //color
    }
    if (type === actors.p25_ball) {
        context.fillStyle = p25color; //color
    }
    context.fill();
}

function findOptionalMoves(x, y) {
    const options = [];
    if (x - 1 >= 0 && isClear(x - 1, y)) options.push({x: x - 1, y: y}); //left
    if (y - 1 >= 0 && isClear(x, y - 1)) options.push({x: x, y: y - 1}); //up
    if (x + 1 <= board_size - 1 && isClear(x + 1, y))
        options.push({x: x + 1, y: y}); //right
    if (y + 1 <= board_size - 1 && isClear(x, y + 1))
        options.push({x: x, y: y + 1}); //down

    return options;
}

function isClear(x, y) {
    let cellIsClear;
    cellIsClear =
        board[x][y] !== actors.obstacles &&
        dark_side_board[x][y] !== actors.red &&
        dark_side_board[x][y] !== actors.blue &&
        dark_side_board[x][y] !== actors.pink;

    return cellIsClear;
}
