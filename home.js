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
