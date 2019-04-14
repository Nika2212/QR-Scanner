const video = document.createElement("video");
const canvasElement = document.getElementById("canvas");
const canvas = canvasElement.getContext("2d");
const popup = document.getElementById('result-popup');
const loadingMessage = document.getElementById("loadingMessage");
const outputMessage = document.getElementById('outputMessage');
const clipboardButton = document.getElementById('clipboardButton');
const closeButton = document.getElementById('closeButton');
let dWidth = 640;
closeButton.onclick = () => popupToggle(false);
clipboardButton.onclick = () => {
    // document.getElementById('tempTextArea').remove();
    const temporaryTextArea = document.createElement('textarea');
    temporaryTextArea.style.position = 'absolute';
    temporaryTextArea.style.opacity = '0';
    temporaryTextArea.style.pointerEvents = 'none';
    temporaryTextArea.value = outputMessage.innerText;
    temporaryTextArea.id = 'tempTextArea';
    document.body.appendChild(temporaryTextArea);
    temporaryTextArea.select();
    document.execCommand('Copy');
};

setDisplayOptions();
function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
}
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", 'true');
    video.play().then(message => {});
    requestAnimationFrame(tick);
});
function tick() {
    loadingMessage.innerText = "Please Wait";
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;
        canvasElement.height = dWidth / 1.333333333;
        canvasElement.width = dWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        if (code) {
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#61ff6d");
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#61ff6d");
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#61ff6d");
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#61ff6d");
            popupToggle(true);
            outputMessage.innerText = code.data;
            // code.data არის ტექსტი რომელიც კოდშია.
        }
    }
    requestAnimationFrame(tick);
}
function popupToggle(state) {
    if (state) {
        popup.style.display = 'flex';
    } else {
        popup.style.display = 'none';
        outputMessage.innerText = '';
        document.getElementById('tempTextArea').remove();
    }
}
function setDisplayOptions() {
    if (window.innerWidth < 640 && window.innerWidth >= 320) {
        dWidth = window.innerWidth;
    }
}
