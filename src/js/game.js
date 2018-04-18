var el = document.getElementById('js-canvas')
var countEl = document.getElementById('js-count')
var countlvl = document.getElementById('js-level-count')
var countuntilnextlvl = document.getElementById('js-until-next-level')
var ctx = el.getContext('2d')
var count = 0;
var level = 1;
var countuntilnextlevel = 0;


function getCookie(cname) {

    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}


count = getCookie("trees");
if (count == "") {

    count = 0
}

level = getCookie("level");
if (level == "") {
    level = 1
}

countuntilnextlevel = count - (level * level * 5)


countEl.innerHTML = count
countlvl.innerHTML = level
countuntilnextlvl.innerHTML = "Next Level: " + countuntilnextlevel

document.cookie = "trees= " + count + "; expires=24 Dec 2099 12:00:00 UTC";
document.cookie = "level= " + level + "; expires=24 Dec 2099 12:00:00 UTC";


var initialState = {
    startPhase: 1,

    pixels: {
        width: 20,
        height: 20
    },

    phases: {
        1: [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
        ],

        2: [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1],
            [0, 1, 0, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
        ],

        3: [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [1, 0, 0, 0, 1],
            [1, 1, 0, 0, 1],
            [0, 0, 1, 1, 1],
            [0, 1, 0, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
        ],

        4: [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1],
            [1, 1, 0, 0, 1],
            [0, 0, 1, 1, 1],
            [0, 1, 0, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
        ],

        5: [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 1, 0, 1, 0],
            [1, 0, 1, 1, 1],
            [1, 1, 0, 1, 1],
            [0, 0, 1, 1, 1],
            [0, 1, 0, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
        ],

        6: [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 1, 1, 1, 0],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
        ]
    }
}

initialState.canvas = {
    width: initialState.phases[1][0].length * initialState.pixels.width,
    height: initialState.phases[1].length * initialState.pixels.height
}

initialState.maxPhases = Object.keys(initialState.phases).length

el.width = initialState.canvas.width
el.height = initialState.canvas.height

var currentPhase = initialState.startPhase


init(initialState)

function init(state) {
    update(ctx, state, currentPhase)

    el.addEventListener('click', function () {
        currentPhase++
        if ((currentPhase - 1) === state.maxPhases) {
            currentPhase = 1
            count++

        }

        countuntilnextlevel = count - (level * level * 5)
        if (count >= level * level * 5) {
            level++
        }

        update(ctx, state, currentPhase)
        countEl.innerHTML = count
        countlvl.innerHTML = level
        countuntilnextlvl.innerHTML = "Next Level: " + countuntilnextlevel

        document.cookie = "trees= " + count + "; expires=24 Dec 2099 12:00:00 UTC";
        document.cookie = "level= " + level + "; expires=24 Dec 2099 12:00:00 UTC";

    })
}

function createPhase(phase, state) {
    phase.forEach(function (row, i) {
        row.forEach(function (col, j) {
            if (col !== 1) return;
            const x = state.pixels.width * j;
            const y = state.pixels.height * i;

            ctx.fillStyle = '#228b22';
            ctx.fillRect(x, y, state.pixels.width, state.pixels.height)
        })
    })
}

function update(ctx, state, current) {
    ctx.clearRect(0, 0, state.canvas.width, state.canvas.height)
    createPhase(state.phases[current], state)
}


function resetScores() {
    document.cookie = "trees=; expires=24 Dec 1291 12:00:00 UTC";
    document.cookie = "level=; expires=24 Dec 1291 12:00:00 UTC";
    count = 0;
    level = 1;

    countuntilnextlevel = count - (level * level * 5)
    if (count >= level * level * 5) {
        level++
    }


    countEl.innerHTML = count;
    countlvl.innerHTML = level;
    countuntilnextlvl.innerHTML = "Next Level: " + countuntilnextlevel


}
