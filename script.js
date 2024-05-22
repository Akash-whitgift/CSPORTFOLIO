let isModalOpen = false;
let modal;
function openModal(modalId) {
  modal = document.getElementById(modalId);
  modal.style.display = "block";
  isModalOpen = true;

  // Prevent scrolling of both image track and modal content when modal opens
  document.getElementById('image-track').removeEventListener('wheel', handleWheel, { passive: false });
  modal.querySelector('.text-overlay').addEventListener('wheel', allowModalScroll, { passive: false, capture: true });

  history.pushState({ modalId }, "", `#${modalId}`);
}

function allowModalScroll(event) {
  console.log('yes');
  const modalContent = modal.querySelector('.text-overlay');
  const contentHeight = modalContent.scrollHeight;
  const clientHeight = modalContent.clientHeight;
  const currentTop = parseInt(window.getComputedStyle(modalContent).top, 10) || 0;

  if (contentHeight > clientHeight) {
    console.log('scrolling');
    let newTop = currentTop - event.deltaY;

    // Prevent scrolling beyond the content limits
    if (newTop > 0) {
      newTop = 0;
    } else if (newTop < clientHeight - contentHeight) {
      newTop = clientHeight - contentHeight;
    }

    modalContent.style.top = `${newTop}px`;
    event.preventDefault();
  } else {
    console.log('no scroll');
    event.preventDefault();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
  document.body.style.overflow = "";
  isModalOpen = false;

  // Allow scrolling on image track and remove modal scroll prevention when modal closes
  document.getElementById('image-track').addEventListener('wheel', handleWheel, { passive: false });
  modal.querySelector('.text-overlay').removeEventListener('wheel', allowModalScroll);

  if (history.state && history.state.modalId === modalId) {
    history.back();
  }
}

function preventTrackScroll(event) {
  event.preventDefault();
}

function preventModalScroll(event) {
  event.preventDefault();
}

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("popstate", function (event) {
    if (event.state && event.state.modalId) {
      closeModal(event.state.modalId);
    } else {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => modal.style.display = "none");
    }
  });

  const images = document.querySelectorAll(".image");
  images.forEach((image, index) => {
    image.addEventListener("click", () => openModal(`modal${index + 1}`));
  });

  function initializeImageTrack() {
    const track = document.getElementById("image-track");

    if (!track) {
      console.error("The 'image-track' element is not found.");
      return;
    }

    const WindowUpdateSize = (e) => {
      let isMobile = window.innerWidth <= 600;
    };
    let isMobile = window.innerWidth <= 600;

    if (isMobile) {
      // Mobile touch events
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
        if (!isModalOpen) {
          isPointerDown = true;
          initialPointerY = e.clientY || e.touches[0].clientY;
        }
      };

      const handlePointerMove = (e) => {
        if (isPointerDown && !isModalOpen) {
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
      // Desktop mouse events
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
        if (!isModalOpen) {
          isMouseDown = true;
          initialMouseX = e.clientX;
        }
      };

      const handleMouseMove = (e) => {
        if (isMouseDown && !isModalOpen) {
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
        if (!isModalOpen) {
          const delta = e.deltaY || e.detail || e.wheelDelta;
          const scrollAmount = delta * scrollSensitivity;
          const maxDelta = window.innerHeight / 2;

          lastKnownPercentage = Math.max(
            Math.min(lastKnownPercentage + (scrollAmount / maxDelta) * -100, -10),
            -100
          );

          updateTransform();
          e.preventDefault();
        }
      };

      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("wheel", handleWheel, { passive: false });
    }

    window.addEventListener("resize", WindowUpdateSize, { passive: false });
  }

  initializeImageTrack();
});
