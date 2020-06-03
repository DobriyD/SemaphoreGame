const lights = Array.prototype.slice.call(document.querySelectorAll('.light-strip'));
const time = document.querySelector('.time');
const best = document.querySelector('.best span');
let bestTime = Number(localStorage.getItem('best')) || Infinity;
let started = false;
let lightsOutTime = 0;
let raf;
let timeOut;

// time show content

function formatTime(time) {
    time = Math.round(time);
    let outputTime = time / 1000;
    if (time < 10000) {
        outputTime = '0' + outputTime;
    }
    while (outputTime.length < 6) {
        outputTime += '0';
    }
    return outputTime;
}

// saving the best resulf

if (bestTime != Infinity) {
    best.textContent = formatTime(bestTime);
}

// remove red circle after start

function start() {
    for (const light of lights) {
        light.classList.remove('on');
    }

    time.textContent = '00.000';
    time.classList.remove('anim');

    lightsOutTime = 0;
    let lightsOn = 0;
    const lightsStart = performance.now();
    // time gap for starting
    function frame(now) {
        const toLight = Math.floor((now - lightsStart) / 1000) + 1;

        if (toLight > lightsOn) {
            for (const light of lights.slice(0, toLight)) {
                light.classList.add('on');
            }
        }

        if (toLight < 5) {
            raf = requestAnimationFrame(frame);
        }
        else {
            const delay = Math.random() * 4000 + 1000;
            timeOut = setTimeout(() => {
                for (const light of lights) {
                    light.classList.remove('on');
                    light.classList.add('go')
                }
                lightsOutTime = performance.now();
            }, delay);

        }
    }

    raf = requestAnimationFrame(frame);
}

// end of game

function end(timeStamp) {
    cancelAnimationFrame(raf);
    clearTimeout(timeOut);
// bad end
    if (!lightsOutTime) {
        time.textContent = 'Фальстарт!';
        time.classList.add('anim');
        return;
    }
    // good end
    else {
        const thisTime = timeStamp - lightsOutTime;
        time.textContent = formatTime(thisTime);

        if (thisTime < bestTime) {
            bestTime = thisTime;
            best.textContent = time.textContent;
            localStorage.setItem('best', thisTime);
        }

        time.classList.add('anim');
    }
}

// killer ficha

function tap(event) {
    let timeStamp = performance.now();

    if (!started && event.target && event.target.closest && event.target.closest('a')) return;
    event.preventDefault();

    if (started) {
        end(timeStamp);
        started = false;
    }
    else {
        start();
        started = true;
    }
}

addEventListener('mousedown', event => {
    if (event.button === 0) tap(event);
});

addEventListener('keydown', event => {
    if (event.key == ' ') tap(event);
});