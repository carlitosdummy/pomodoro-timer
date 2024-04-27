document.addEventListener('DOMContentLoaded', () => {
    //$ Variables

    //! Query selector shortcuts
    const $ = (selector) => document.querySelector(selector);

    //! Finish time audio
    const finishTime = new Audio('../sounds/finish_time.mp3');
    finishTime.volume = 0.3;
    
    //! Quick options
    let $pomodoroButton = $('.qo-pomodoro');
    let $shortBreakButton = $('.qo-short-bk');
    let $largeBreakButton = $('.qo-large-bk');

    //! Default time for pomodoro, short break and large break
    let defaultTimePomodoro = $('#pomodoro-input').value * 60;
    let defaultTimeShortBreak = $('#short-bk-input').value * 60;
    let defaultTimeLargeBreak = $('#large-bk-input').value * 60;
    
    //! Pomodoro
    let $playButton = $('.play-pause');
    let $outerSphere = $('.outer');
    let $sphere = $('.sphere');
    let $timer = $('#time');
    let timeLeft = defaultTimePomodoro;
    let isRunning = false;
    let idAudio;
    setTimeInTimer()

    //! Settings
    let $settingsButton = $('.settings-icon');
    let $applySettings = $('.apply-settings');

    // ? show settings and blur other elements
    $settingsButton.addEventListener('click', () => {
        $('.settings').style.opacity = 1;
        blurEelem();

        $('.close-settings').addEventListener('click', () => {
            $('.settings').style.opacity = 0;
            $applySettings.classList.remove('applied-stg');
            undoBlurEelem();
        })
    });

    //? apply settings
    $applySettings.addEventListener('click', () => {
        defaultTimePomodoro = $('#pomodoro-input').value * 60;
        defaultTimeShortBreak = $('#short-bk-input').value * 60;
        defaultTimeLargeBreak = $('#large-bk-input').value * 60;
        $applySettings.classList.add('applied-stg');
        resetTimer()
    });

    //$ Quick options
    //? Pomodoro button
    $pomodoroButton.addEventListener('click', () => {
        if (isRunning) return;
        $pomodoroButton.classList.add('option-selected');
        $shortBreakButton.classList.remove('option-selected');
        $largeBreakButton.classList.remove('option-selected');
        timeLeft = defaultTimePomodoro;
        setTimeInTimer()
    });

    //? Short break button
    $shortBreakButton.addEventListener('click', () => {
        if (isRunning) return;
        $shortBreakButton.classList.add('option-selected');
        $pomodoroButton.classList.remove('option-selected');
        $largeBreakButton.classList.remove('option-selected');
        timeLeft = defaultTimeShortBreak;
        setTimeInTimer()
    });

    //? Large break button
    $largeBreakButton.addEventListener('click', () => {
        if (isRunning) return;
        $largeBreakButton.classList.add('option-selected');
        $pomodoroButton.classList.remove('option-selected');
        $shortBreakButton.classList.remove('option-selected');
        timeLeft = defaultTimeLargeBreak;
        setTimeInTimer()
    });

    //$ Timer
    //? Set the default time in the timer function
    function setTimeInTimer() {
        const minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        $timer.textContent = formattedTime;
    }

    //? Start, pause and reset the timer function
    $playButton.addEventListener('click', () => {
        if ($playButton.textContent === 'PLAY') {
            $playButton.textContent = 'PAUSE';
            $playButton.style.backgroundColor = '#458588';
            $outerSphere.classList.add('normal-blink');
            startTimer()
        }else if ($playButton.textContent === 'PAUSE') {
            $playButton.textContent = 'PLAY';
            $playButton.style.backgroundColor = '#45858896';
        } else {
            $playButton.textContent = 'PLAY';
            $playButton.style.backgroundColor = '#45858896';
            $outerSphere.classList.remove('quick-blink');
            resetTimer()
        }
    });

    //? starTimer function 
    function startTimer() {
        isRunning = true
        updateTimer()
        $sphere.style.animation = `rotation ${timeLeft}s linear infinite`;
        $sphere.style.animationPlayState = 'running';
        timerInterval = setInterval(updateTimer, 1000);
    }

    //? stopTimer function
    function stopTimer() {
        finishTime.play();
        $sphere.style.animationPlayState = 'paused';
        $outerSphere.classList.add('quick-blink');
        $outerSphere.classList.remove('normal-blink');
        clearInterval(timerInterval);
        $playButton.textContent = 'RESET';
        $playButton.style.backgroundColor = '#af3a03';
        $playButton.style.color = '#f9f5d7';
        idAudio = createTimerInterval();
    }

    //? updateTimer function
    function updateTimer() {
        setTimeInTimer()
        timeLeft--;
        if (timeLeft < 0) stopTimer();
    }

    //? blur elements function
    function blurEelem() {
        $('.title').classList.add('blur');
        $('.quick-options').classList.add('blur');
        $('.timer').classList.add('blur');
        $('.settings-icon').classList.add('blur');
        $('.play-pause').classList.add('blur');
    }

    //? undo blur elements function
    function undoBlurEelem() {
        $('.title').classList.remove('blur');
        $('.quick-options').classList.remove('blur');
        $('.timer').classList.remove('blur');
        $('.settings-icon').classList.remove('blur');
        $('.play-pause').classList.remove('blur');
    }

    //? reset timer function using the current state of the timer
    function resetTimer() {
        let nextTime;
        if ($pomodoroButton.classList.contains('option-selected')) nextTime = defaultTimePomodoro;
        else if ($shortBreakButton.classList.contains('option-selected')) nextTime = defaultTimeShortBreak;
        else if ($largeBreakButton.classList.contains('option-selected')) nextTime = defaultTimeLargeBreak;
        timeLeft = nextTime;
        isRunning = false;
        setTimeInTimer()
        cancelTimerInterval()
    }
    
    //? create the timer interval
    function createTimerInterval() {
        return setInterval(() => finishTime.play(), 6000);
    }

    //? cancel the timer interval
    function cancelTimerInterval() {
        finishTime.pause();
        clearInterval(idAudio);
    }

});