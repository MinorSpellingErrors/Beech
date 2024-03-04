const track = document.getElementById("image-track");

const handleOnDown = e => track.dataset.mouseDownAt = e.clientY;

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";  
  track.dataset.prevPercentage = track.dataset.percentage;
}

const handleOnMove = e => {
  if(track.dataset.mouseDownAt === "0") return;
  
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientY,
        maxDelta = window.innerHeight / 1.5;
  
  const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
  
  track.dataset.percentage = nextPercentage;
  
  track.animate({
    transform: `translate(-50%, ${nextPercentage}%)`
  }, { duration: 1800, fill: "forwards" });
  
  for(const image of track.getElementsByClassName("image")) {
    image.animate({
      objectPosition: ` center ${100 + nextPercentage}%`
    }, { duration: 1800, fill: "forwards" });
  }
}

window.onmousedown = e => handleOnDown(e);

window.ontouchstart = e => handleOnDown(e.touches[0]);

window.onmouseup = e => handleOnUp(e);

window.ontouchend = e => handleOnUp(e.touches[0]);

window.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]);

/* end of code for drag to scroll */
/* start of code for image grow on click */

const images = document.querySelectorAll(".image");
const titles = document.querySelectorAll("h1");

images.forEach(image => {
  image.addEventListener("click", toggleImageSize);
});

function toggleImageSize(event) {
  const image = event.target;
  const isFullScreen = image.classList.contains("full-screen");

  if (!isFullScreen) {
    document.body.classList.add("no-scroll");
    titles.forEach(title => {
      title.style.display = "none";
    });
    images.forEach(img => {
      if (img !== image) {
        img.style.display = "none";
      }
    });
    image.classList.add("full-screen");
    image.style.zIndex = "2";
    image.style.filter = "drop-shadow(5px 5px 5px rgba(0,0,0,0.3))";
    growImage(image);
    centerImage(image);
  } else {
    document.body.classList.remove("no-scroll");
    titles.forEach(title => {
      title.style.display = "initial";
    });
    images.forEach(img => {
      img.style.display = "initial";
    });
    image.classList.remove("full-screen");
    image.style.zIndex = "auto";
    image.style.filter = "none";
    resetImageSize(image);
    resetImagePosition(image);
  }
}

function growImage(image) {
  const originalWidth = image.naturalWidth;
  const originalHeight = image.naturalHeight;
  
  const newWidth = originalWidth * .8;
  const newHeight = originalHeight * .8;

  image.style.width = `${newWidth}px`;
  image.style.height = `${newHeight}px`;
}

function resetImageSize(image) {
  image.style.width = "80vmin";
  image.style.height = "28vmin";
}

function centerImage(image) {
  image.style.position = "fixed";
  image.style.top = "50%";
  image.style.left = "50%";
  image.style.transform = "translate(-50%, 10%)";
}

function resetImagePosition(image) {
  image.style.position = "static";
  image.style.transform = "none";
}

document.addEventListener("click", event => {
  if (!event.target.classList.contains("image")) {
    const fullScreenImage = document.querySelector(".image.full-screen");
    if (fullScreenImage) {
      toggleImageSize({ target: fullScreenImage });
    }
  }
});
