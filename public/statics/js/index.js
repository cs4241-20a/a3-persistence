window.onload = () => {
    const logoutButton = document.getElementById('logoutButton')
    const submitXMLButton = document.getElementById("uploadXML")
    const playButton = document.getElementById('playButton')
    submitXMLButton.onclick = loadXML
    logoutButton.onclick = logout
    
    fetch('/authStatus', {
        method: "GET",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => res.json())
    .then(res => {
        if(res.authStatus){
            const preloginElems = document.querySelectorAll(".preLogin")
            preloginElems.forEach((elem) => {
                elem.style = "display: none"
            })
        }
        else{
            const postLoginElems = document.querySelectorAll(".postLogin")
            postLoginElems.forEach((elem) => {
                elem.style = "display: none"
            })
        }
    })
}

const logout = () => {
    fetch("/logout", {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if(res.status === 200){
            //We logged out
            console.log("Bree")
            const preLoginElems = document.querySelectorAll(".preLogin")
            preLoginElems.forEach((elem) => {
                elem.style = "display: block"
            })
            const postLoginElems = document.querySelectorAll(".postLogin")
            postLoginElems.forEach((elem) => {
                elem.style = "display: none"
            })
            window.location.pathname = '/login'
        }
    })
}

const loadXML = (e) => {
    e.preventDefault()
    const formData = new FormData()
    const songName = document.querySelector("#songName").value 
    const xmlFile = document.querySelector("#fileUpload").files[0]
    console.log(songName)
    formData.append("songName", songName)
    console.log(formData.get("song"))
    formData.append("xmlFile", xmlFile )
    fetch('/uploadXML', {
        credentials: 'include',
        method: 'POST',
        body: formData
    }).then(res => res.json())
    .then(res => {
        window.AudioContext = 
            window.AudioContext ||
			window.webkitAudioContext ||
			navigator.mozAudioContext ||
            navigator.msAudioContext;
            
		var audioContext = new window.AudioContext();
        console.log(ABCJS.synth)
        // const synthControl = ABCJS.synth.synthController();
        // console.log(synthControl)
        const viewObj = ABCJS.renderAbc('abcjsRender', res.abcString)
        const synth = new ABCJS.synth.CreateSynth()
        console.log(ABCJS.synth.instrumentIndexToName)
        synth.init({
            audioContext: audioContext,
            visualObj: viewObj[0],
            millisecondsPerMeasure: 1846,
        }).then((synthRes) => {
            console.log(synthRes)
            synth.prime().then((val) => {
                console.log(val)
                synth.start()
            })
        }).then(() => {
            // synth.start()
            return Promise.resolve()
        })
        .catch((err) => {
            console.log(err)
        })

        // const abcJsSynth = new ABCJS.synth.CreateSynth()
        // console.log(viewObj)
        // abcJsSynth.init({
        //     visualObj: viewObj[0],
        //     audioContext: window.AudioContext,
        //     millisecondsPerMeasure: visualObj.millisecondsPerMeasure()
        // }).then((synthf) => {
        //     console.log(synthf)
        // })
        // const synths = []
        // playButton.onclick = () => {
        //     const now = Tone.now() + 0.5
        //     midi.tracks.forEach((track) => {
        //         const synth = new Tone.PolySynth(10, Tone.Synth, {
        //             envelope: {
        //                 attack: 0.02,
        //                 decay: 0.1,
        //                 sustain: 0.3,
        //                 release: 1
        //             }
        //         }).toMaster()
        //         synths.push(synth)
        //         track.notes.forEach(note => {
        //             synth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity)
        //         }) 
        //     })
        // }
    })
}