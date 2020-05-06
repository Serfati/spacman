var red_ghost_shape = {},
    blue_ghost_shape = null,
    pink_ghost_shape = null;
yellow_ghost_shape = null;

function insertGhost(x_center, y_center, color) {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var img = new Image();
    img.src = "assets/images/" + color + "_ghost.gif";
    ctx.drawImage(
        img,
        x_center + 3,
        y_center,
        0.9 * (canvasWidth / board_size),
        0.9 * (canvasHeight / board_size)
    );
}

function findOptimalPathToPacMan(x, y) {
    var options = findOptionalMoves(x, y);

    var choice = options[0];
    var minManhattanDist = manhattanDistance(
        pac_man_shape.i,
        pac_man_shape.j,
        choice.x,
        choice.y
    );

    for (var k = 1; k < options.length; k++) {
        if (
            manhattanDistance(
                pac_man_shape.i,
                pac_man_shape.j,
                options[k].x,
                options[k].y
            ) < minManhattanDist
        ) {
            choice = options[k];
            minManhattanDist = manhattanDistance(
                pac_man_shape.i,
                pac_man_shape.j,
                options[k].x,
                options[k].y
            );
        }
    }

    return choice;
}

function manhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function findLongPathToPacMan(x, y) {
    var options = findOptionalMoves(x, y);
    var max = 0;
    var max_index = 0;
    var temp_max = 0;
    for (var k = 0; k < options.length; k++) {
        temp_max = Math.sqrt(
            Math.pow(pac_man_shape.i - options[k].x, 2) +
            Math.pow(pac_man_shape.j - options[k].y, 2)
        );
        if (temp_max > max) {
            max = temp_max;
            max_index = k;
        }
    }
    return options[max_index];
}

function randomMove(x, y) {
    var options = findOptionalMoves(x, y);
    var choice = Math.floor(Math.random() * options.length);
    return options[choice];
}

function updateGhosts() {
    var pair_red;
    if (!gift_mode) {
        var randomPath = Math.random();
        if (randomPath <= 0.2)
            pair_red = randomMove(red_ghost_shape.i, red_ghost_shape.j);
        else
            pair_red = findOptimalPathToPacMan(red_ghost_shape.i, red_ghost_shape.j);
    } else pair_red = findLongPathToPacMan(red_ghost_shape.i, red_ghost_shape.j);
    dark_side_board[red_ghost_shape.i][red_ghost_shape.j] = 0;
    dark_side_board[pair_red.x][pair_red.y] = 5;
    red_ghost_shape.i = pair_red.x;
    red_ghost_shape.j = pair_red.y;

    if (blue_ghost_shape != null) {
        var pair_blue;
        if (!gift_mode) {
            var randomPath = Math.random();
            if (randomPath <= 0.25)
                pair_blue = randomMove(blue_ghost_shape.i, blue_ghost_shape.j);
            else
                pair_blue = findOptimalPathToPacMan(
                    blue_ghost_shape.i,
                    blue_ghost_shape.j
                );
        } else
            pair_blue = findLongPathToPacMan(blue_ghost_shape.i, blue_ghost_shape.j);
        dark_side_board[blue_ghost_shape.i][blue_ghost_shape.j] = 0;
        dark_side_board[pair_blue.x][pair_blue.y] = 6;
        blue_ghost_shape.i = pair_blue.x;
        blue_ghost_shape.j = pair_blue.y;
    }

    if (pink_ghost_shape != null) {
        var pair_pink;
        if (!gift_mode) {
            var randomPath = Math.random();
            if (randomPath <= 0.25)
                pair_pink = randomMove(pink_ghost_shape.i, pink_ghost_shape.j);
            else
                pair_pink = findOptimalPathToPacMan(
                    pink_ghost_shape.i,
                    pink_ghost_shape.j
                );
        } else
            pair_pink = findLongPathToPacMan(pink_ghost_shape.i, pink_ghost_shape.j);
        dark_side_board[pink_ghost_shape.i][pink_ghost_shape.j] = 0;
        dark_side_board[pair_pink.x][pair_pink.y] = 7;
        pink_ghost_shape.i = pair_pink.x;
        pink_ghost_shape.j = pair_pink.y;
    }

    if (yellow_ghost_shape != null) {
        var pair_yellow;
        if (!gift_mode) {
            var randomPath = Math.random();
            if (randomPath <= 0.25)
                pair_yellow = randomMove(yellow_ghost_shape.i, yellow_ghost_shape.j);
            else
                pair_yellow = findOptimalPathToPacMan(
                    yellow_ghost_shape.i,
                    yellow_ghost_shape.j
                );
        } else
            pair_yellow = findLongPathToPacMan(
                yellow_ghost_shape.i,
                yellow_ghost_shape.j
            );
        dark_side_board[yellow_ghost_shape.i][yellow_ghost_shape.j] = 0;
        dark_side_board[pair_yellow.x][pair_yellow.y] = 7;
        yellow_ghost_shape.i = pair_yellow.x;
        yellow_ghost_shape.j = pair_yellow.y;
    }
}
function putGhosts() {
    dark_side_board[0][0] = actors.red;
    red_ghost_shape.i = 0;
    red_ghost_shape.j = 0;

    if (number_of_ghost >= 2) {
        blue_ghost_shape = {};
        dark_side_board[0][board_size - 1] = actors.blue;
        blue_ghost_shape.i = 0;
        blue_ghost_shape.j = board_size - 1;
    }
    if (number_of_ghost >= 3) {
        pink_ghost_shape = {};
        dark_side_board[board_size - 1][0] = actors.pink;
        pink_ghost_shape.i = board_size - 1;
        pink_ghost_shape.j = 0;
    }
    if (number_of_ghost >= 4) {
        yellow_ghost_shape = {};
        dark_side_board[board_size - 1][0] = actors.yellow;
        yellow_ghost_shape.i = board_size - 1;
        yellow_ghost_shape.j = 0;
    }
}
function checkCollisions() {
    if (
        red_ghost_shape.i === pac_man_shape.i &&
        red_ghost_shape.j === pac_man_shape.j
    ) {
        Finish();
        return true;
    }

    if (
        blue_ghost_shape != null &&
        blue_ghost_shape.i === pac_man_shape.i &&
        blue_ghost_shape.j === pac_man_shape.j
    ) {
        Finish();
        return true;
    }

    if (
        pink_ghost_shape != null &&
        pink_ghost_shape.i === pac_man_shape.i &&
        pink_ghost_shape.j === pac_man_shape.j
    ) {
        Finish();
        return true;
    }

    if (
        yellow_ghost_shape != null &&
        yellow_ghost_shape.i === pac_man_shape.i &&
        yellow_ghost_shape.j === pac_man_shape.j
    ) {
        Finish();
        return true;
    }
}
function clearGhosts() {
    dark_side_board[red_ghost_shape.i][red_ghost_shape.j] = actors.nothing;
    dark_side_board[moving_food_shape.i][moving_food_shape.j] = actors.nothing;

    if (number_of_ghost >= 2)
        dark_side_board[blue_ghost_shape.i][blue_ghost_shape.j] = actors.nothing;

    if (number_of_ghost >= 3)
        dark_side_board[pink_ghost_shape.i][pink_ghost_shape.j] = actors.nothing;

    if (number_of_ghost >= 4)
        dark_side_board[yellow_ghost_shape.i][yellow_ghost_shape.j] =
            actors.nothing;
}
