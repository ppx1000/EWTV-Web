const track = document.querySelector('.slideshow-track');
const slides = document.querySelectorAll('.slideshow-track img');
const totalSlides = slides.length; // 6 Bilder (5 + Kopie)
let index = 0;

function slide() {
  index++;
  track.style.transition = 'transform 2s ease-in-out';
  track.style.transform = `translateX(-${index * 100}vw)`;

  // Wenn wir beim letzten Bild (Kopie von Bild 1) sind
  if (index === totalSlides - 1) {
    // Nach der Übergangszeit (2s) zurück auf Anfang springen
    setTimeout(() => {
      track.style.transition = 'none'; // Sofort zurückspringen
      track.style.transform = 'translateX(0)';
      index = 0;
    }, 2000); // muss gleich lang wie oben (2s) sein
  }
}

// Start bei Bild 0
track.style.transform = 'translateX(0)';

// Alle 6 Sekunden Bild wechseln
setInterval(slide, 6000);

// Website start
window.addEventListener("load", () => {
  const overlay = document.getElementById("welcome-overlay");
  const page = document.getElementById("page-content");

  // Schon in diesem Tab gezeigt? Dann sofort weg damit.
  if (sessionStorage.getItem("welcomeShown") === "1") {
    overlay.style.display = "none";
    page.classList.remove("hidden");
    return;
  }

  // Markieren: in diesem Tab einmal gezeigt
  sessionStorage.setItem("welcomeShown", "1");

  // Normaler weicher Ablauf
  setTimeout(() => {
    overlay.style.opacity = "0";
    page.classList.remove("hidden");
  }, 2000);

  setTimeout(() => {
    overlay.style.display = "none";
  }, 3500);
});
