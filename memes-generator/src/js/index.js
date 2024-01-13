const addTextBtn = document.querySelector(".add-text-btn");
const downloadMemeBtn = document.querySelector(".download-btn");
const canvas = document.querySelector(".meme-canvas");
const canvasCtx = canvas.getContext("2d");
const radioGroup = document.querySelector(".radio-group");
const colorsSelect = document.getElementById("color-select");
const fontFamilySelect = document.getElementById("color-family-select");
const fontSizeInput = document.getElementById("font-size-input");
const selectImgBtn = document.querySelector(".select-img-btn");
const selectFileInput = document.querySelector(".select-file-input");

let memeImg = new Image();
const texts = [];
let selectedText = null;

addTextBtn.addEventListener("click", () => {
  const userInput = prompt("Please enter some text:", "");
  if (userInput === null) {
    return;
  }

  texts.push({
    fontSize: 24,
    font: "serif",
    color: "white",
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: null,
    text: userInput,
  });
  render();
});

function render() {
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = memeImg.width;
  canvas.height = memeImg.height;
  canvasCtx.drawImage(memeImg, 0, 0);
  texts.forEach((text) => {
    canvasCtx.font = `${text.fontSize}px ${text.font}`;
    canvasCtx.fillStyle = text.color;
    text.width = canvasCtx.measureText(text.text).width;
    canvasCtx.fillText(text.text, text.x, text.y);
  });

  if (selectedText !== null) {
    colorsSelect.disabled = false;
    fontFamilySelect.disabled = false;
    fontSizeInput.disabled = false;

    colorsSelect.value = texts[selectedText].color;
    fontFamilySelect.value = texts[selectedText].font;
    fontSizeInput.value = texts[selectedText].fontSize;
  } else {
    colorsSelect.disabled = true;
    fontFamilySelect.disabled = true;
    fontSizeInput.disabled = true;
  }
}

function dragElement(elmnt) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  elmnt.onmousedown = onMouseDown;

  function onMouseDown(e) {
    e.preventDefault();

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    selectedText = null;
    texts.forEach((text, idx) => {
      if (
        text.width !== null &&
        x >= text.x &&
        x <= text.x + text.width &&
        y <= text.y &&
        y >= text.y - text.fontSize
      ) {
        selectedText = idx;
      }
    });
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = onMouseUp;
    document.onmousemove = onMouseMove;
    render();
  }

  function onMouseMove(e) {
    e.preventDefault();
    if (selectedText === null) {
      return;
    }
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    texts[selectedText].x -= pos1;
    texts[selectedText].y -= pos2;
    render();
  }

  function onMouseUp() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

downloadMemeBtn.addEventListener("click", () => {
  const dataURL = canvas.toDataURL("image/png");
  const downloadLink = document.createElement("a");
  downloadLink.href = dataURL;
  downloadLink.download = "meme.png";
  downloadLink.click();
});

colorsSelect.addEventListener("change", (e) => {
  texts[selectedText].color = e.target.value;
  render();
});

fontFamilySelect.addEventListener("change", (e) => {
  texts[selectedText].font = e.target.value;
  render();
});

fontSizeInput.addEventListener("input", (e) => {
  texts[selectedText].fontSize = parseInt(e.target.value);
  render();
});

selectImgBtn.addEventListener("click", () => {
  selectFileInput.click();
});
selectFileInput.addEventListener("change", (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = function (event) {
      memeImg.src = event.target.result;
    };
    reader.readAsDataURL(selectedFile);
  }
});
memeImg.onload = function () {
  render();
};
memeImg.src = "assets/images/placeholder.png";
dragElement(canvas);
