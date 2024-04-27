document.addEventListener('DOMContentLoaded', () => {
    //$ Variables

    //! Query selector shortcuts
    const $ = (selector) => document.querySelector(selector);

    //! Finish time audio
    //todo: select user audio from the settings, for now, it's a default audio
    //todo: change the volume of the audio in the settings
    const finishTime = new Audio('../sounds/finish_time.mp3');
    finishTime.volume = 0.3;
    
    //! Quick options
    //todo: add a slice effect to change between the options
    let $quickOptions = $('.quick-options');
    let $pomodoroButton = $('.qo-pomodoro');
    let $shortBreakButton = $('.qo-short-bk');
    let $largeBreakButton = $('.qo-large-bk');

    //! Default time for pomodoro, short break and large break
    //todo: save the settings in the local storage
    //todo: chech if the user's input is a number and if it's not a number, show a message to the user
    let defaultTimePomodoro
    let defaultTimeShortBreak
    let defaultTimeLargeBreak
    getSetInputValue()
    
    //! Pomodoro
    let $title = $('.title');
    let $currentOption = $('.option-selected');
    let $timerContainer = $('.timer')
    let $timer = $('#time');
    let $outerSphere = $('.outer');
    let $sphere = $('.sphere');
    let $playButton = $('.play-pause');
    let timeLeft = defaultTimePomodoro;
    let isRunning = false;
    let idAudio;
    setTimeInTimer()

    //! Settings
    let $settingsButton = $('.settings-icon');
    let $applySettings = $('.apply-settings');

    //! Volumen settings
    let $inputVolume = $('.volume-input');
    let $showVolume = $('.show-volume');

    //! Blur elements 
    let blueElements = [$title, $quickOptions, $timerContainer, $playButton, $settingsButton];

    //? show settings and blur other elements
    $settingsButton.addEventListener('click', () => {
        $('.settings').style.opacity = 1;
        $('.settings').style.zIndex= 1;
        blueOrUnblur(blueElements, 'add');

        $('.close-settings').addEventListener('click', () => {
            $('.settings').style.opacity = 0;
            $('.settings').style.zIndex= 0;
            $applySettings.classList.remove('applied-stg');
            blueOrUnblur(blueElements, 'remove');
        })
    });

    //? get the user's input 
    function getSetInputValue() {
        defaultTimePomodoro = $('#pomodoro-input').value * 60;
        defaultTimeShortBreak = $('#short-bk-input').value * 60;
        defaultTimeLargeBreak = $('#large-bk-input').value * 60;
    }

    //? change and show the volume of the audio
    $inputVolume.addEventListener('input', () => {
        finishTime.volume = $inputVolume.value / 100;
        $showVolume.textContent = $inputVolume.value
    });

    //? apply settings
    $applySettings.addEventListener('click', () => {
        getSetInputValue();
        $applySettings.classList.add('applied-stg');
        resetTimer()
    });

    //$ Quick options
    //? Select the current option and update the time in the timer
    function selectCurrentOption(currentOption, newOption) {
        if (isRunning) return;
        newOption.classList.add('option-selected');
        currentOption.classList.remove('option-selected');
        $currentOption = newOption
        if (newOption.classList.contains('qo-pomodoro')) timeLeft = defaultTimePomodoro;
        else if (newOption.classList.contains('qo-short-bk')) timeLeft = defaultTimeShortBreak;
        else timeLeft = defaultTimeLargeBreak;
        setTimeInTimer()
    }

    //? Pomodoro button
    $pomodoroButton.addEventListener('click', () => {
        selectCurrentOption($currentOption, $pomodoroButton)
    });

    //? Short break button
    $shortBreakButton.addEventListener('click', () => {
        selectCurrentOption($currentOption, $shortBreakButton)
    });

    //? Large break button
    $largeBreakButton.addEventListener('click', () => {
        selectCurrentOption($currentOption, $largeBreakButton)
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
            //todo: add a pause function
            console.log('pause');
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
        $sphere.style.animation = `rotation ${timeLeft}s linear infinite`;
        $sphere.style.animationPlayState = 'running';
        updateTimer()
        timerInterval = setInterval(updateTimer, 1000);
    }

    //? stopTimer function
    function stopTimer() {
        clearInterval(timerInterval);
        finishTime.play();
        idAudio = createTimerInterval();
        $sphere.style.animationPlayState = 'paused';
        $outerSphere.classList.add('quick-blink');
        $outerSphere.classList.remove('normal-blink');
        $playButton.textContent = 'RESET';
        $playButton.style.backgroundColor = '#af3a03';
        $playButton.style.color = '#f9f5d7';
    }

    //? updateTimer function
    function updateTimer() {
        setTimeInTimer()
        timeLeft--;
        if (timeLeft < 0) stopTimer();
    }

    //? blueOrUnblur function
    const blueOrUnblur = (elements, action) => elements.forEach(element => element.classList[action]('blur'));

    //? reset timer function using the current state of the timer
    function resetTimer() {
        if ($currentOption.classList.contains('qo-pomodoro')) timeLeft = defaultTimePomodoro;
        else if ($currentOption.classList.contains('qo-short-bk')) timeLeft = defaultTimeShortBreak;
        else timeLeft = defaultTimeLargeBreak;
        isRunning = false;
        setTimeInTimer()
        cancelTimerInterval()
    }
    
    //? create the timer interval
    const createTimerInterval = () => setInterval(() => finishTime.play(), 6000);

    //? cancel the timer interval
    function cancelTimerInterval() {
        finishTime.pause();
        clearInterval(idAudio);
    }
});