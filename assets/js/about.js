function openModel() {
    model = document.getElementById("model");
    model.classList.add('active');
    overlay = document.getElementById("overlay");
    overlay.classList.add('active');

    document.getElementById("menu").style.position = "static";
    document.getElementById("overlay").addEventListener("click", function () {
        closeModel();
    });

    document.addEventListener("keydown", isEsc);
}

function isEsc(e) {
    let keyChoose = e.code;
    if (keyChoose == "Escape") {
        closeModel();
    }
}

function closeModel() {
    model = document.getElementById("model");
    model.classList.remove('active');
    overlay = document.getElementById("overlay");
    overlay.classList.remove('active');
    document.getElementById("menu").style.position = "relative";
    document.removeEventListener("click", function () {
        closeModel();
    });


}