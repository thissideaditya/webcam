let video = document.querySelector("video")
let captureBtnCont = document.querySelector(".capture-btn-cont")
let captureBtn = document.querySelector(".capture-btn")
let transparentColor = "transparent"
let recordBtnCont = document.querySelector(".record-btn-cont")
let recordBtn = document.querySelector(".record-btn")

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
    recorder.addEventListener("start", () => {
        chunks = []
    })

    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data)
    })

    recorder.addEventListener("stop", () => {
        // let blob = new Blob(chunks, {type: 'video/mp4'})
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
    // let img = document.createElement("img")
    // img.src = imageUrl
    // document.body.append(img)
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