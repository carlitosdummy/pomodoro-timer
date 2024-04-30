document.addEventListener('DOMContentLoaded', () => {
    //$ Variables
    //! Query selector shortcuts
    const $ = (selector) => document.querySelector(selector);

    //! Finish time audio
    //todo: select user audio from the settings, for now, it's a default audio (?)
    const finishTime = new Audio('../sounds/finish_time.mp3');
    finishTime.volume = 0.3;
    
    //! Quick options
    let $quickOptions = $('.quick-options');
    let $pomodoroButton = $('.qo-pomodoro');
    let $shortBreakButton = $('.qo-short-bk');
    let $largeBreakButton = $('.qo-large-bk');
    let $sliderOptions = $('.curr-selected');

    const BEGIN_POMODORO = 0
    const BEGIN_SHORT_BREAK = 154
    const BEGIN_LARGE_BREAK = 308

    //! Default time for pomodoro, short break and large break
    //todo: save the settings in the local storage
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
        if ($('#pomodoro-input').value < 1) defaultTimePomodoro = 1 * 60
        else if ($('#pomodoro-input').value > 180) defaultTimePomodoro = 180 * 60
        else defaultTimePomodoro = $('#pomodoro-input').value * 60;
        $('#pomodoro-input').value = defaultTimePomodoro / 60;

        if ($('#short-bk-input').value < 1) defaultTimeShortBreak = 1 * 60
        else if ($('#short-bk-input').value > 30) defaultTimeShortBreak = 30 * 60
        else defaultTimeShortBreak = $('#short-bk-input').value * 60;
        $('#short-bk-input').value = defaultTimeShortBreak / 60;

        if ($('#large-bk-input').value < 1) defaultTimeLargeBreak = 1 * 60
        else if ($('#large-bk-input').value > 60) defaultTimeLargeBreak = 60 * 60
        else defaultTimeLargeBreak = $('#large-bk-input').value * 60;
        $('#large-bk-input').value = defaultTimeLargeBreak / 60;
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
        moveSliderToCurrentOption()
    });

    //? Short break button
    $shortBreakButton.addEventListener('click', () => {
        selectCurrentOption($currentOption, $shortBreakButton)
        moveSliderToCurrentOption()
    });

    //? Large break button
    $largeBreakButton.addEventListener('click', () => {
        selectCurrentOption($currentOption, $largeBreakButton)
        moveSliderToCurrentOption()
    });

    //? Move the slider to the current option
    function moveSliderToCurrentOption() {
        if ($currentOption.classList.contains('qo-pomodoro')) $sliderOptions.style.transform = `translateX(${BEGIN_POMODORO}px)`;
        else if ($currentOption.classList.contains('qo-short-bk')) $sliderOptions.style.transform = `translateX(${BEGIN_SHORT_BREAK}px)`;
        else $sliderOptions.style.transform = `translateX(${BEGIN_LARGE_BREAK}px)`;
    }

    //$ Timer
    //? Set the default time in the timer function
    function setTimeInTimer() {
        const minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        $timer.textContent = formattedTime;
    }
    //todo: fix the sphere animation when the timer is paused It's skipping the some pixels
    //? Start, pause and reset the timer function
    $playButton.addEventListener('click', () => {
        if ($playButton.textContent === 'PLAY') {
            $playButton.textContent = 'PAUSE';
            $playButton.style.backgroundColor = '#458588';
            $outerSphere.classList.add('normal-blink');
            startTimer()
        }else if ($playButton.textContent === 'PAUSE') {
            pauseTimer()
            $outerSphere.classList.remove('normal-blink');
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

    //? pauseTimer function
    function pauseTimer() {
        clearInterval(timerInterval);
        $sphere.style.animationPlayState = 'paused';

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