let dbAccess ;
let container = document.querySelector(".container");
let backBtn = document.querySelector(".back");
let request = indexedDB.open("Camera2",2);
  request.addEventListener("success",function(){
     dbAccess = request.result
})
backBtn.addEventListener("click",()=>{
    location.assign("index.html");
})

request.addEventListener("upgradeneeded",function(){
    console.log("jdjd");
    let db = request.result
    db.createObjectStore("gallery",{keyPath:"mId"})
})

request.addEventListener("error",function(){
    alert("some error occured")
})

function addmedia(type,media){
    let tx = dbAccess.transaction("gallery","readwrite");
    let galleryObject = tx.objectStore("gallery");
    let data = {
     mId: Date.now(),
     type,
     media,
    }
    galleryObject.add(data);
}
function viewMedia(){
let tx = dbAccess.transaction("gallery","readonly");
let galleryObject = tx.objectStore("gallery");
let req = galleryObject.openCursor();
req.addEventListener("success",function(){
    let cursor = req.result;
    if(cursor){
        let div = document.createElement("div");
        div.classList.add("media-card");

        div.innerHTML = `<div class = "media-container">
        </div>
        <div class = "action-container">
        <button class = "media-download">Download</button>
        <button class = "media-delete" data-id = "${cursor.value.mId}">Delete</button>
        </div>`;
        let downloadBtn = div.querySelector(".media-download");
        let deleteButton = div.querySelector(".media-delete");
        deleteButton.addEventListener("click",(e)=>{
            let mId = e.currentTarget.getAttribute("data-id");
            e.currentTarget.parentElement.parentElement.remove();
            deletemediaFromDb(mId);
        })
        if(cursor.value.type == "img"){
            let img = document.createElement("img");
            img.classList.add("media-gallery");
            img.src = cursor.value.media;
            let midiaContainer = div.querySelector(".media-container");
            midiaContainer.appendChild(img);

            downloadBtn.addEventListener("click",(e) =>{
                let a = document.createElement("a");
                a.download = "image.jpg";
                a.href =e.currentTarget.parentElement.parentElement.querySelector(".media-container").children[0].src ;
                a.click();
                a.remove();
            })
        }
        else{
            let video = document.createElement("video");
            video.classList.add("media-gallery");
            video.src =window.URL.createObjectURL(cursor.value.media);
            video.load();
            video.addEventListener("mouseenter",() =>{
                video.play();
            })
            video.addEventListener("mouseleave",() =>{
                video.currentTime = 0;
                video.pause();
               
            })
            video.controls = true;
            let midiaContainer = div.querySelector(".media-container");
            midiaContainer.appendChild(video);
            downloadBtn.addEventListener("click",(e) =>{
                let a = document.createElement("a");
                a.download = "video.mp4";
                a.href =e.currentTarget.parentElement.parentElement.querySelector(".media-container").children[0].src ;
                a.click();
                a.remove();
            })

        }
        container.appendChild(div);
        cursor.continue();
    }
})
}
function deletemediaFromDb(mId){
    let tx = dbAccess.transaction("gallery","readwrite");
    let galleryObject = tx.objectStore("gallery");
    galleryObject.delete(Number(mId));
}

