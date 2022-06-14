let video = document.querySelector("video")
let captureBtnCont = document.querySelector(".capture-btn-cont")
let captureBtn = document.querySelector(".capture-btn")
let transparentColor = "transparent"
let recordBtnCont = document.querySelector(".record-btn-cont")
let recordBtn = document.querySelector(".record-btn")
let timer = document.querySelector(".timer")

let recorder
let chunks = []
let constraints = {
    video:true,
    audio:true
}
let shouldRecord = false

navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream

    recorder = new MediaRecorder(stream)
    recorder.addEventListener("start", (e) => {
        chunks = []
        console.log('recording started')
    })

    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data)
        console.log('data pushed in chunks')
    })

    recorder.addEventListener("stop", () => {
        let blob = new Blob(chunks, {type: 'video/mp4'})
        console.log('recording stopped')
        // To download on desktop
        let videoURL = URL.createObjectURL(blob)
        console.log(videoURL)

        let a = document.createElement('a')
        a.href = videoURL
        a.download = 'myVideo.mp4'
        a.click()

    })
})

// click photo
captureBtnCont.addEventListener("click", () => {
    let canvas = document.createElement("canvas")
    let tool = canvas.getContext("2d")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    tool.drawImage(video, 0, 0, canvas.width, canvas.height)

    //applying filters
    tool.fillStyle = transparentColor
    tool.fillRect(0, 0, canvas.width, canvas.height)

    let imageUrl = canvas.toDataURL()
    let img = document.createElement("img")
    img.src = imageUrl
    document.body.append(img)
})
// record a video
recordBtnCont.addEventListener("click", () =>{
    shouldRecord = !shouldRecord
    if(shouldRecord){
        // start recording
        recorder.start()
        // start timer
        startTimer()
    }
    else{
        // stop recorder
        recorder.stop()
        // stop timer
        stopTimer()
    }
})

let counter = 0
let timerID
function startTimer(){
    timer.style.display = 'block'
    function displayTimer(){
        let totalSeconds = counter

        let hours = Number.parseInt(totalSeconds/3600)
        totalSeconds = totalSeconds%3600
       
        let minutes = Number.parseInt(totalSeconds/60)
        totalSeconds = totalSeconds%60

        let seconds = Number.parseInt(totalSeconds)

        hours = (hours<10)? `0${hours}` : hours
        minutes = (minutes<10)? `0${minutes}` : minutes
        seconds = (seconds<10)? `0${seconds}` : seconds

        timer.innerText = `${hours}:${minutes}:${seconds}`

        counter++

    }

    timerID = setInterval(displayTimer, 1000)

}

function stopTimer(){
    clearInterval(timerID)
    timer.innerText = "00:00:00"
    timer.style.display = 'none'
}