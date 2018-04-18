var canvas = document.getElementById('canvas');
var treeCount = document.getElementById('tree-count');
var levelCount = document.getElementById('level-count');
var untilNextLevel = document.getElementById('until-next-level');
var ctx = canvas.getContext('2d');
var count = 0;
var level = 1;
var countUntilNextLevel = 0;


function getCookie(cname) {

    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


//Load scores if available
count = getCookie("trees");

if (count === "") {
    count = 0
}

level = getCookie("level");
if (level === "") {
    level = 1
}

//calculate count until next level
countUntilNextLevel = (level * level * 5) - count;


treeCount.innerHTML = count.toString();
levelCount.innerHTML = level.toString();
untilNextLevel.innerHTML = "Next Level in " + countUntilNextLevel + " Trees";

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
            [0, 0, 1, 0, 0]
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
            [0, 0, 1, 0, 0]
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
            [0, 0, 1, 0, 0]
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
            [0, 0, 1, 0, 0]
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
            [0, 0, 1, 0, 0]
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
            [0, 0, 1, 0, 0]
        ]
    }
};

initialState.canvas = {
    width: initialState.phases[1][0].length * initialState.pixels.width,
    height: initialState.phases[1].length * initialState.pixels.height
};

initialState.maxPhases = Object.keys(initialState.phases).length;

canvas.width = initialState.canvas.width;
canvas.height = initialState.canvas.height;

var currentPhase = initialState.startPhase;


init(initialState);

function init(state) {
    update(ctx, state, currentPhase);

    canvas.addEventListener('click', function () {
        currentPhase++;
        if ((currentPhase - 1) === state.maxPhases) {
            currentPhase = 1;
            count++

        }

        countUntilNextLevel = (level * level * 5) - count;
        if (count >= level * level * 5) {
            level++
        }

        update(ctx, state, currentPhase);

        treeCount.innerHTML = count.toString();
        levelCount.innerHTML = level.toString();
        untilNextLevel.innerHTML = "Next Level in " + countUntilNextLevel + " Trees";

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
            ctx.fillRect(x, y, state.pixels.width, state.pixels.height);
        })
    })
}

function update(ctx, state, current) {
    ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
    createPhase(state.phases[current], state);
}


function resetScores() {
    document.cookie = "trees=; expires=24 Dec 1291 12:00:00 UTC";
    document.cookie = "level=; expires=24 Dec 1291 12:00:00 UTC";
    count = 0;
    level = 1;

    countUntilNextLevel = (level * level * 5) - count;
    if (count >= level * level * 5) {
        level++;
    }


    treeCount.innerHTML = count.toString();
    levelCount.innerHTML = level.toString();
    untilNextLevel.innerHTML = "Next Level in " + countUntilNextLevel + " Trees"
}
