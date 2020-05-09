$("#btn_login, #nav_login").click(function () {
  hideAll();
  $("#login").show();
});

$("#btn_register, #nav_register").click(function () {
  hideAll();
  $("#register").show();
});

$("#home_mode").click(function () {
  hideAll();
  $("#welcome").show();
  stopMusic();
});

$("#nav_game").click(function () {
  hideAll();
  $("#game").show();
  $("#container_pre_game").show();
  $("#container_game").hide();
  $("#ball_numm").val("50");
  $("#ghost_num").val("3");
  $("#game_time").val("60");
  $("#5points").val("#FFFFFF");
  $("#15points").val("#7495E0");
  $("#25points").val("#E34C27");
});

$("#nav_about").click(function () {
  hideAll();
  $("#about").show();
});

$("#btn_play").click(function () {
  hideAll();
  $("#game").show();
  $("#container_pre_game").show();
  $("#container_game").hide();
  $("#ball_numm").val("50");
  $("#ghost_num").val("3");
  $("#game_time").val("60");
  $("#level_check").val("6");
  $("#5points").val("#FFFFFF");
  $("#15points").val("#7495E0");
  $("#25points").val("#E34C27");
});

function hideAll() {
  $("#welcome").hide();
  $("#game").hide();
  $("#login").hide();
  $("#register").hide();
  $("#about").hide();
}

let users = [];
let user_login = false;
let active_user = null;
let message = "";
$(document).ready(function () {
  const first_person = {
    firstName: "Corona",
    lastName: "Virus",
    username: "p",
    password: "p",
    email: "p@post.bgu.ac.il",
    birthday: "01/01/01",
  };
  users.push(first_person);

  $("#sign_in").click(function () {
    let valid = true;
    let username = "";
    let password = "";
    $("#alert_details_login").empty();
    $("#alert_login").hide();

    if ($("#l ogin_username").val() == "") {
      valid = false;
      message += "Username not valid <br >";
    } else username = $("#login_username").val();

    if ($("#login_password").val() == "") {
      valid = false;
      message += "Password not valid <br >";
    } else password = $("#login_password").val();

    let user = "";
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username)
        if (users[i].password === password) {
          user = users[i];
          break;
        }
    }

    if (!valid || user === "") {
      $("#alert_details_login").empty();
      $("#alert_details_login").html(message);
      $("#alert_login").show();
    } else {
      user_login = true;
      active_user = user;
      $("#welcome").show();
      $("#game").hide();
      $("#login").hide();
      $("#game_user").show();
      $("#register").hide();
      $("#register_user").hide();
      $("#login_user").hide();
      $("#logout_user").show();
      $("#btn_login").hide();
      $("#btn_register").hide();
      $("#player_name").empty();
      const user_fullname = active_user.firstName + " " + active_user.lastName;
      $("#player_name").html(user_fullname);
      $("#welcome_text").text("You may play now!");
      $("#btn_play").show();
    }
  });

  $("#logout_user").click(function () {
    user_login = false;
    active_user = "";
    $("#welcome").show();
    $("#game").hide();
    $("#login").hide();
    $("#register").hide();
    $("#game_user").hide();
    $("#already_login").hide();
    $("#register_user").show();
    $("#login_user").show();
    $("#logout_user").hide();
    $("#btn_login").show();
    $("#btn_register").show();
    $("#btn_play").hide();
    $("#welcome_text").text(
        "Please login/Register if you already have an account"
    );
    stopMusic();
    {
      window.clearInterval(interval);
      cold_start = true;
      get_bonus = false;
      poison_mode = false;
      clearTimeout(poison_timeout);
      gift_mode = false;
      clearTimeout(gift_timeout);
      pac_color = "yellow";
      gameOver = false;
      blue_ghost_shape = null;
      pink_ghost_shape = null;
      yellow_ghost_shape = null;
    }
    hearts = 2; //actually 3
    gameOver = false;
    clearInterval(countDownTimer);
    time_left = max_game_time;
    $("#container_pre_game").show;
    $("#container_game").hide;
  });

  const modal = document.getElementById("about");

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  $(document).keyup(function (ev) {
    if (ev.keyCode == 27) $("#about").trigger("click");
  });

  $("#continue_register").click(function () {
    let valid = true;
    let firstName = "";
    let lastName = "";
    let username = "";
    let password = "";
    let email = "";
    let birthday = "";
    message = "<br/>";
    $("#alert_details").empty();
    $("#alert_register").hide();

    if (!validName($("#firstName").val(), "first")) {
      //First name
      valid = false;
    } else firstName = $("#firstName").val();

    if (!validName($("#lastName").val(), "last")) {
      valid = false;
    } else {
      lastName = $("#lastName").val();
    }

    if ($("#username").val() === "") {
      //User name
      valid = false;
      message += "Username not valid - mandatory field <br >";
    } else {
      if (userExists($("#username").val())) {
        valid = false;
        message +=
          "Username already taken. Please choose a new username. <br/>";
      } else username = $("#username").val();
    }

    if (!passValid($("#pass").val())) {
      valid = false;
    } else password = $("#pass").val();

    if (!validEmail($("#email").val())) {
      valid = false;
      message += "Email not valid <br >";
    } else email = $("#email").val();

    if ($("#datepicker").val() === "") {
      valid = false;
      message += "Date not valid <br >";
    } else birthday = $("#datepicker").val();

    if (!valid) {
      $("#alert_details").empty();
      $("#alert_details").html(message);
      $("#alert_register").show();
    } else {
      const person = {
        firstName,
        lastName,
        username,
        password,
        email,
        birthday,
      };
      users.push(person);
      $("#register").hide();
      $("#login").show();
    }
  });

  function validName(name, position) {
    if (name === "") {
      message += "Please enter your name<br/>";
      return false;
    } else {
      for (let i = 0; i < name.length; i++) {
        if (!name.charAt(i).match(/[a-z]/i)) {
          message += "Your " + position + " name may only contain letters<br/>";
          return false;
        }
      }
    }
    return true;
  }

  function passValid(pass) {
    let containsNumber = false;
    let containsAlpha = false;
    if (pass.length < 8) {
      message += "Password not valid, must contain at least 8 characters <br >";
      return false;
    }
    for (let i = 0; i < pass.length; i++) {
      if (pass.charAt(i) >= "0" && pass.charAt(i) <= "9") containsNumber = true;
      else if (pass.charAt(i).match(/[a-z]/i)) {
        containsAlpha = true;
      } else {
        message += "Password may only contain alpha-numeric characters. <br>";
        return false;
      }
    }
    if (!(containsAlpha && containsNumber))
      message +=
        "Password not valid, must contain numbers AND characters <br >";
    return containsAlpha && containsNumber;
  }

  function validEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.match(re);
  }
});
$("#alert_register").hide();
$("#alert_login").hide();

var modal = document.getElementById("about_c");

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

$(document).keyup(function (ev) {
  if (ev.keyCode == 27) $("#about_c").trigger("click");
});

function map1(board, dark_side_board) {
  const pacmanMaze = [
    [0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    [2, 0, 2, 2, 0, 2, 0, 2, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 2, 2, 2],
    [2, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 2, 0, 2, 2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2],
    [2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 2, 0, 0, 2, 0, 0, 0, 2],
    [2, 0, 2, 2, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0, 2, 0, 0, 0, 2],
    [2, 2, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 2, 2],
    [2, 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 0, 2, 2, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 2, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 2, 0, 2, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],
  ];

  for (let i = 0; i < pacmanMaze.length; i++) {
    for (let j = 0; j < pacmanMaze.length; j++) {
      if (pacmanMaze[i][j] === 2) board[i][j] = actors.obstacles;
    }
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      dark_side_board[i][j] = board[i][j];
    }
  }
}

function userExists(userName) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === userName) return true;
  }
  return false;
}

function aletrtBox(color, message, font_size) {
  context.beginPath();
  board_width = document.getElementById("canvas").width;
  board_height = document.getElementById("canvas").height;
  context.rect(0, board_height / 4, board_width, board_height * 0.3);
  context.fillStyle = color; //color
  context.fill();

  context.font = font_size + " 'pacmanfont'";
  context.fillStyle = "black"; //color
  context.fillText(message, board_width / 5, board_height / 2);
}
function printTime(time_left_seconds) {
  let minutes = Math.floor(time_left_seconds / 60);
  let seconds = Math.floor(time_left_seconds % 60);

  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  return minutes + ":" + seconds;
}
function printHearts(number_of_hearts) {
  let toPrint = "";
  for (let i = 0; i < number_of_hearts; i += 1)
    toPrint += "❤";
  return toPrint;
}