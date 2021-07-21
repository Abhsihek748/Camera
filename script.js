let body = document.querySelector("body");
let video = document.querySelector("video");
let buttonRecord = document.querySelector(".record");
let buttonCapture = document.querySelector(".capture");
let constrains = {video :true , audio:false};
let isrecording = false;
let mediaRecorder;
let chunks = [];
let filters = document.querySelectorAll(".filter");
let filter = "";
let zoomIn = document.querySelector(".zoom-in");
let zoomOut = document.querySelector(".zoom-out");
let gallerybtn = document.querySelector("#gallery");
let minZoom = 1;
let maxZoom = 3;
let currZoom =1;

gallerybtn.addEventListener("click" , function(){
    location.assign("gallery.html")
  })
  
for(let i = 0 ; i < filters.length;i++){
    filters[i].addEventListener("click",function(e){
        filter = e.currentTarget.style.backgroundColor;
        removeFilter();
        applyFilter(filter);
    })
}

buttonRecord.addEventListener("click",function(e){
    let innerDiv = buttonRecord.querySelector("div");
    if(isrecording){
     mediaRecorder.stop();
     isrecording = false;
     innerDiv.classList.remove("record-animation");
    }
    else{
    mediaRecorder.start();
    filter = "";
    removeFilter();
    currZoom =1;
    video.style.transform = (`scale(${currZoom})`);
    isrecording = true;
     innerDiv.classList.add("record-animation");
    }
})
buttonCapture.addEventListener("click",function(e){
    let innerDiv = buttonCapture.querySelector("div");
    innerDiv.classList.add("capture-animation");
    setTimeout( ()=>{
        innerDiv.classList.remove("capture-animation");

    },500);
    capture();
})

zoomIn.addEventListener("click",function(e){
    let vidCurrScale= video.style.transform.split("(")[1].split(")")[0];
    if(vidCurrScale > maxZoom){
     return;
    }
    else{
        currZoom += 0.1;
        video.style.transform = (`scale(${currZoom})`);
    }
})
zoomOut.addEventListener("click",function(e){
    if(currZoom > minZoom){
     currZoom -= 0.1;
     video.style.transform = (`scale(${currZoom})`);
    }
})

navigator.mediaDevices.getUserMedia(constrains).then(function(mediaStream){  
    // navigator lets ur connect to browser to device ,
    //  mediaDevices lets u browser to get media input ,
    //  getUserMedia is a promise let u return output stram relevent to contstrains
    // video.srcObject recieves the src as the value we get from getUserMedia
    video.srcObject = mediaStream;
    let options = { mimeType: "video/webm; codecs=vp9" };
    mediaRecorder = new MediaRecorder(mediaStream, options);
    console.log(mediaRecorder);            
    mediaRecorder.addEventListener("dataavailable",function(e){
        chunks.push(e.data);
    })
    mediaRecorder.addEventListener("stop",function(e){
        let blob = new Blob(chunks , {type :"video/mp4"});
        addmedia("video",blob);
        chunks = [];
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "video.mp4";
        a.click();
        a.remove();
    })
});
function capture(){
    let c = document.createElement("canvas");
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    let ctx = c.getContext("2d");
    ctx.translate(c.width/2,c.height/2);
    ctx.scale(currZoom,currZoom);
    ctx.translate(-c.width/2,-c.height/2);
    ctx.drawImage(video,0,0);
    if(filter != ""){
        ctx.fillStyle = filter;
        ctx.fillRect(0,0,c.width.c.height);
    }
    let a = document.createElement("a");
    a.download = "image.jpg";
    a.href = c.toDataURL();
    addmedia("img",c.toDataURL());
    a.click();
    a.remove();
    }

function applyFilter(filterColor){
    let filterDiv = document.createElement("div");
    filterDiv.classList.add("filter-div");
    filterDiv.style.backgroundColor = filterColor;
    body.appendChild(filterDiv);
}
function removeFilter(){
    let filterDiv = document.querySelector(".filter-div");
    if(filterDiv)
    filterDiv.remove();

}