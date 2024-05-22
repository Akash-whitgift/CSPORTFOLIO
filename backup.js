function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "block";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
}
document.addEventListener("DOMContentLoaded", function () {
  function initializeImageTrack() {
    const track = document.getElementById("image-track");

    if (!track) {
      console.error("The 'image-track' element is not found.");
      return;
    }
    const WindowUpdateSize = (e) => {
      let isMobile = window.innerWidth <= 600;
    }
    let isMobile = window.innerWidth <= 600; 

    if (isMobile) {
      let isPointerDown = false;
      let initialPointerY = 0;
      let lastKnownPercentage = -50; 
      let pointerSensitivity = 0.03; // Sensitivity factor for touch and mouse scrolling
      let parallaxFactor = 0.5;

      const updateTransform = () => {
        track.style.transform = `translate(-50%, ${lastKnownPercentage}%)`;

        for (const image of track.getElementsByClassName("image")) {
          const verticalOffset = (lastKnownPercentage / 100) * parallaxFactor * 100;
          image.style.objectPosition = `center ${50 + verticalOffset}%`;
        }
      };

      const handlePointerDown = (e) => {
        isPointerDown = true;
        initialPointerY = e.clientY || e.touches[0].clientY;

        if (!isPointerDown) {
          lastKnownPercentage = -50; // Reset to -50
        }
      };

      const handlePointerMove = (e) => {
        if (isPointerDown) {
          const pointerDelta = (e.clientY || e.touches[0].clientY) - initialPointerY;
          const maxDelta = window.innerHeight / 2;

          lastKnownPercentage = Math.max(
            Math.min(lastKnownPercentage + (pointerDelta / maxDelta) * 100 * pointerSensitivity, -50),
            -350 
          );




          updateTransform();
        }
      };

      const handlePointerUp = () => {
        isPointerDown = false;
      };

      window.addEventListener("mousedown", handlePointerDown);
      window.addEventListener("touchstart", handlePointerDown);

      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("touchmove", handlePointerMove);

      window.addEventListener("mouseup", handlePointerUp);
      window.addEventListener("touchend", handlePointerUp);
    } else {
      let isMouseDown = false;
      let initialMouseX = 0;
      let lastKnownPercentage = -10; 
      let dragSensitivity = 0.01; 
      let scrollSensitivity = 0.2;

      const updateTransform = () => {
        track.style.transform = `translate(${lastKnownPercentage}%, -50%)`;

        for (const image of track.getElementsByClassName("image")) {
          image.style.objectPosition = `${100 + lastKnownPercentage}% center`;
        }
      };

      const handleMouseDown = (e) => {
        isMouseDown = true;
        initialMouseX = e.clientX;


        if (!isMouseDown) {
          lastKnownPercentage = -10; // Reset to -10
        }
      };

      const handleMouseMove = (e) => {
        if (isMouseDown) {
          const mouseDelta = initialMouseX - e.clientX;
          const maxDelta = window.innerWidth / 2;

          lastKnownPercentage = Math.max(
            Math.min(lastKnownPercentage + (mouseDelta / maxDelta) * -100 * dragSensitivity, -10),
            -100
          );

          updateTransform();
        }
      };

      const handleMouseUp = () => {
        isMouseDown = false;
      };

      const handleWheel = (e) => {
        const delta = e.deltaY || e.detail || e.wheelDelta;


        const scrollAmount = delta * scrollSensitivity;
        const maxDelta = window.innerHeight / 2;

        lastKnownPercentage = Math.max(
          Math.min(lastKnownPercentage + (scrollAmount / maxDelta) * -100, -10),
          -100
        );

        updateTransform();


        e.preventDefault();
      };

      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("wheel", handleWheel, { passive: false });

    }
    window.addEventListener("resize", WindowUpdateSize, { passive: false});
  }


  const images = document.querySelectorAll(".image");
  images.forEach((image, index) => {
    image.addEventListener("click", () => openModal(`modal${index + 1}`));
  });

  initializeImageTrack();
});
