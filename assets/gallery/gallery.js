let backBtn = document.querySelector(".back");
backBtn.addEventListener("click", () => {
  location.assign("../../index.html");
});


setTimeout(() => {
  if (db) {
    let imageDbTransaction = db.transaction("image", "readonly");
    let imageStore = imageDbTransaction.objectStore("image");
    let imageRequest = imageStore.getAll();
    imageRequest.onsuccess = () => {
      let imageResult = imageRequest.result;
      let galleryCont = document.querySelector(".gallery-cont");
      imageResult.forEach((imageObj) => {
        let imageElem = document.createElement("div");
        imageElem.setAttribute("class", "captured");
        imageElem.setAttribute("id", imageObj.id);

        let url = imageObj.url;

        imageElem.innerHTML = `
          <div class="data">
              <img src="${url}"/>
          </ div>
          <div class="data-2" id='${imageObj.id}'>
              <span class="material-icons delete">
                  delete
                  </span>
              <span class="material-icons download">
                  arrow_downward
                  </span>
          </div>
          `;

        galleryCont.appendChild(imageElem);

        let deleteBtn = imageElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteListener);

        let downloadBtn = imageElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListener);
      });
    };

    let videoDbTransaction = db.transaction("video", "readonly");
    let videoStore = videoDbTransaction.objectStore("video");
    let videoRequest = videoStore.getAll();
    videoRequest.onsuccess = () => {
      let videoResult = videoRequest.result;
      let galleryCont = document.querySelector(".gallery-cont");

      videoResult.forEach((videoObj) => {
        let videoElem = document.createElement("div");
        videoElem.setAttribute("class", "captured");
        videoElem.setAttribute("id", videoObj.id);
        let url = URL.createObjectURL(videoObj.blobData);

        videoElem.innerHTML = `
          <div class="data">
              <video autoplay loop src="${url}" alt="media"></video>
          </ div>
          <div class="data-2" id='${videoObj.id}'>
              <span class="material-icons delete">
                  delete
                  </span>
              <span class="material-icons download">
                  arrow_downward
                  </span>
          </div>

          `;
        galleryCont.appendChild(videoElem);
        
        let deleteBtn = videoElem.querySelector(".delete");
        deleteBtn.addEventListener("click", deleteListener);

        let downloadBtn = videoElem.querySelector(".download");
        downloadBtn.addEventListener("click", downloadListener);
      });
    };
  }
}, 100);

function deleteListener(e) {
  let id = e.target.parentElement.getAttribute("id")
  let type = id.split("-")[0];
  console.log(type);

  if (type == "vid") {
    // remove from database
    let videoDBTransaction = db.transaction("video", "readwrite");
    let videoStore = videoDBTransaction.objectStore("video");
    videoStore.delete(id);

  } else if ((type = "img")) {
    // remove from database
    let imageDBTransaction = db.transaction("image", "readwrite");
    let imageStore = imageDBTransaction.objectStore("image");
    imageStore.delete(id);

  }
  
  document.querySelector(`#${id}`).remove()

}

function downloadListener(e) {
  let id = e.target.parentElement.getAttribute("id");
  let type = id.split("-")[0];

  if (type == "vid") {
    let videoDBTransaction = db.transaction("video", "readonly");
    let videoStore = videoDBTransaction.objectStore("video");
    let videoRequest = videoStore.get(id);
    videoRequest.onsuccess = () => {
      let videoResult = videoRequest.result;
      let url = URL.createObjectURL(videoResult.blobData);
      let a = document.createElement("a");
      a.href = url;
      a.download = "myVideo.mp4";
      a.click();
    };
  }
  if (type == "img") {
    let imageDBTransaction = db.transaction("image", "readonly");
    let imageStore = imageDBTransaction.objectStore("image");
    let imageRequest = imageStore.get(id);
    imageRequest.onsuccess = () => {
      let imageResult = imageRequest.result;
      let imageURL = imageResult.url;

      let a = document.createElement("a");
      a.href = imageURL;
      a.download = "myPhoto.mp4";
      a.click();
    };
  }
}
