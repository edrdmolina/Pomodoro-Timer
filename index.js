class App extends React.Component {
    constructor(props) {
      super(props)
    
      this.state = {
        breakLength: 5,
        sessionLength: 25,
        timer: 0,
        timerState: false,
        timerType: 'Session',
        intervalID: undefined,
      }

      this.updateTime = this.updateTime.bind(this);
      this.resetTimer = this.resetTimer.bind(this);
      this.makeClock = this.makeClock.bind(this);
      this.countDown = this.countDown.bind(this);
      this.pauseTimer = this.pauseTimer.bind(this);
      this.playSound = this.playSound.bind(this);
    }

    componentDidMount() {
        this.setState(cs => ({
            timer: cs.sessionLength * 60
        }))
    }

    countDown() {
        this.state.intervalID = setInterval(() => {
            let { timerType, timer } = this.state;
            if(timer === 0) {
                this.playSound();
                if(timerType === 'Session') {
                    this.setState(cs => ({
                        timerType: 'Break',
                        timer: cs.breakLength * 60
                    }))
                } else if (timerType === 'Break') {
                    this.setState(cs => ({
                        timerType: 'Session',
                        timer: cs.sessionLength * 60
                    }))
                }
            } else {
                this.setState(cs => ({
                    timer: cs.timer - 1
                }))
            }
        }, 1000);
        this.setState({ timerState: true });
    }

    pauseTimer() {
        clearInterval(this.state.intervalID)
        this.setState({ timerState: false });
    }

    updateTime(id) {
        switch(id) {
            case 'break-decrement':
                if(this.state.breakLength <= 1) return;
                this.setState(cs => ({ breakLength: cs.breakLength - 1 }))
                break;
            case 'break-increment':
                if(this.state.breakLength >= 60) return;
                this.setState(cs => ({ breakLength: cs.breakLength + 1 }))
                break;
            case 'session-decrement':
                if(this.state.sessionLength <= 1) return;
                this.setState(cs => ({ 
                    sessionLength: cs.sessionLength - 1,
                    timer: (cs.sessionLength - 1) * 60
                }));
                break;
            case 'session-increment':
                if(this.state.sessionLength >= 60) return;
                this.setState(cs => ({ 
                    sessionLength: cs.sessionLength + 1,
                    timer: (cs.sessionLength + 1) * 60
                }));
                break;
            default:
                break;
        }
    }
    
    resetTimer() {
        this.pauseTimer();
        const sound = document.getElementById('beep');
        sound.pause()
        sound.currentTime = 0;
        this.setState({
            breakLength: 5,
            sessionLength: 25,
            timerState: false,
            timer: 1500,
            timerType: 'Session',
        })
    }

    makeClock() {
        const { timer } = this.state;
        let minutes = Math.floor(timer / 60);
        let seconds = timer - minutes * 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return { minutes, seconds}
    }

    playSound() {
        const sound = document.getElementById('beep');
        sound.currentTime = 0;
        sound.play();
    }

    render() {
        const { breakLength, sessionLength, timerState, timerType } = this.state;
        const { updateTime, resetTimer, makeClock, countDown, pauseTimer } = this;

        return (
            <div className='App'>
                <h1>Pomodoro Timer</h1>
                <div className='timer-container'>
                    < Timer timerState={timerState} timerType={timerType} makeClock={makeClock}/>
                    < Controls timerState={timerState} reset={resetTimer} countDown={countDown} pauseTimer={pauseTimer} />
                    <div className='options-container'>
                        < Break breakLength={breakLength} updateTime={updateTime} />
                        < Session sessionLength={sessionLength} updateTime={updateTime} />
                    </div>
                </div>
                <audio id='beep' src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav' />
            </div>
        )
    }
}

class Timer extends React.Component {
    constructor(props) {
      super(props)
    
      this.state = {
         
      }
    }
    
    render() {
        const { timerType, makeClock } = this.props;

        let { minutes, seconds } = makeClock();
        let color = 'white';
        if(parseInt(minutes) < 1) color = 'red';
        return (
            <div className='timer'>
                <h2 id='timer-label'>{timerType}</h2>
                <div id='time-left' style={{ color: color }}>
                    { minutes }:{seconds}
                </div>
            </div>
        )
    }
}

class Controls extends React.Component {
    constructor(props) {
      super(props)
    
    }

    render() {
        const { timerState, reset, countDown, pauseTimer } = this.props;

        let startStop = timerState ? (
            <i className="fas fa-pause" id="start_stop" onClick={pauseTimer} />
        ) : ( <i className="fas fa-play" id="start_stop" onClick={countDown}/> )
        

        return (
            <div className='controls'>
                { startStop }
                <i className="fas fa-redo-alt" id='reset' onClick={reset} />
            </div>
        )
    }
}

class Break extends React.Component {
    constructor(props) {
      super(props)
      this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleUpdate(e) {
        this.props.updateTime(e.target.id)
    }
    
    render() {
        const { handleUpdate } = this;
        const { breakLength } = this.props;
        return (
            <div className='options'>
                <h2 id='break-label'>Break Length</h2>
                <div className='options-controls'>
                    <i className="fas fa-arrow-down" id='break-decrement' onClick={handleUpdate} />
                    <div id='break-length'>{breakLength}</div>
                    <i className="fas fa-arrow-up" id='break-increment' onClick={handleUpdate} />
                </div>
            </div>
        )
    }
}

class Session extends React.Component {
    constructor(props) {
      super(props)
      this.handleUpdate = this.handleUpdate.bind(this);
    }
    
    handleUpdate(e) {
        this.props.updateTime(e.target.id)
    }

    render() {
        const { handleUpdate } = this;
        const { sessionLength } = this.props;
        return (
            <div className='options'>
                <h2 id='session-label'>Session Length</h2>
                <div className='options-controls'>
                    <i className="fas fa-arrow-down" id='session-decrement' onClick={handleUpdate} />
                    <div id='session-length'>{sessionLength}</div>
                    <i className="fas fa-arrow-up" id='session-increment' onClick={handleUpdate} />
                </div>
            </div>
        )
    }
}

ReactDOM.render(< App />, document.getElementById('root'));