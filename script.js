// ===============================================
// PORTFOLIO STEPHEN CABROL - JAVASCRIPT V2
// Interactions et animations modernes
// ===============================================

// ========== 1. VARIABLES GLOBALES ==========

const header = document.getElementById("header");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

// ========== 2. HEADER SCROLL EFFECT ==========

// Change l'apparence du header au scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ========== 2.5. EFFET RIPPLE SUR BOUTONS ==========

// Fonction pour créer l'effet ripple
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  // Position du clic
  const rect = button.getBoundingClientRect();
  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - rect.left - radius}px`;
  ripple.style.top = `${event.clientY - rect.top - radius}px`;
  ripple.classList.add("ripple");

  // Supprime l'ancien ripple s'il existe
  const existingRipple = button.querySelector(".ripple");
  if (existingRipple) {
    existingRipple.remove();
  }

  button.appendChild(ripple);

  // Supprime le ripple après l'animation
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Ajoute l'effet ripple à tous les boutons
const buttons = document.querySelectorAll(".btn, button");
buttons.forEach((button) => {
  button.addEventListener("click", createRipple);
});

// ========== 3. SMOOTH SCROLL NAVIGATION ==========

// Scroll fluide vers les sections
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return; // Ignore les liens vers #

    e.preventDefault();

    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      // Ferme le menu mobile AVANT le scroll
      if (navLinks && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        if (menuToggle) menuToggle.classList.remove("active");
        document.body.style.overflow = "";
      }

      // Attend 300ms que le menu se ferme, puis scroll
      setTimeout(() => {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Met à jour la navigation active
        updateActiveLink(targetId);
      }, 300);
    }
  });
});

// ========== 4. ACTIVE LINK HIGHLIGHTING ==========

// Met en surbrillance le lien actif dans la navigation
function updateActiveLink(targetId) {
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === targetId) {
      link.classList.add("active");
    }
  });
}

// Détecte quelle section est visible et met à jour le lien actif
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      updateActiveLink("#" + sectionId);
    }
  });
});

// ========== 5. MOBILE MENU TOGGLE ==========

// Menu mobile complet et fonctionnel (compatible Safari iOS)
if (menuToggle && navLinks) {
  // Fonction pour toggle le menu
  function toggleMenu(e) {
    e.preventDefault();
    e.stopPropagation();

    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("active");

    // Empêche le scroll quand menu ouvert
    if (navLinks.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  // Ajoute les événements click ET touch (pour iOS)
  menuToggle.addEventListener("click", toggleMenu);
  menuToggle.addEventListener("touchstart", toggleMenu, { passive: false });

  // Ferme le menu si on clique/touche en dehors
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("active") &&
      !menuToggle.contains(e.target) &&
      !navLinks.contains(e.target)
    ) {
      navLinks.classList.remove("active");
      menuToggle.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  document.addEventListener("touchstart", (e) => {
    if (
      navLinks.classList.contains("active") &&
      !menuToggle.contains(e.target) &&
      !navLinks.contains(e.target)
    ) {
      navLinks.classList.remove("active");
      menuToggle.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// ========== 6. SCROLL REVEAL ANIMATION ==========

// Anime les éléments quand ils entrent dans le viewport
const scrollRevealElements = document.querySelectorAll(".scroll-reveal");

const revealOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      // Optionnel : arrête d'observer après l'animation
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

scrollRevealElements.forEach((element) => {
  revealObserver.observe(element);
});

// ========== 6.5. ANIMATION BARRES DE COMPÉTENCES ==========

const skillBars = document.querySelectorAll(".skill-progress");

const skillsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const progress = progressBar.getAttribute("data-progress");

        // Applique la largeur avec un petit délai
        setTimeout(() => {
          progressBar.style.setProperty("--progress", progress + "%");
          progressBar.style.width = progress + "%";
          progressBar.classList.add("animated");
        }, 200);

        skillsObserver.unobserve(progressBar);
      }
    });
  },
  {
    threshold: 0.5,
  },
);

skillBars.forEach((bar) => {
  skillsObserver.observe(bar);
});

// ========== 7. PROJET CARDS HOVER EFFECT ==========

// Ajoute un effet de parallax léger au hover des cartes projets
const projetCards = document.querySelectorAll(".projet-card");

projetCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    const rotateX = deltaY * 2; // Rotation légère
    const rotateY = deltaX * -2;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ========== 8. TYPING EFFECT (optionnel) ==========

// Effet de machine à écrire sur le titre du hero
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Décommenter pour activer l'effet typing
// const heroTitle = document.querySelector('.hero h1');
// if (heroTitle) {
//   const originalText = heroTitle.textContent;
//   typeWriter(heroTitle, originalText, 50);
// }

// ========== 9. PERFORMANCE - LAZY LOADING IMAGES ==========

// Les images se chargent uniquement quand elles sont visibles
const images = document.querySelectorAll('img[loading="lazy"]');

if ("loading" in HTMLImageElement.prototype) {
  // Le navigateur supporte le lazy loading natif
  // Rien à faire, c'est déjà géré par l'attribut loading="lazy"
} else {
  // Fallback pour les vieux navigateurs
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// ========== 10. CONSOLE MESSAGE ==========

// Message sympa dans la console pour les curieux
console.log(
  "%c👋 Salut ! ",
  "font-size: 20px; font-weight: bold; color: #3b82f6;",
);
console.log(
  "%cTu aimes fouiller dans le code ? On va bien s'entendre ! 😄",
  "font-size: 14px; color: #64748b;",
);
console.log(
  "%cPortfolio développé avec passion par Stephen Cabrol",
  "font-size: 12px; color: #94a3b8;",
);
console.log(
  "%c📧 dev-web.cabrol@gmail.com",
  "font-size: 12px; color: #10b981; font-weight: bold;",
);

// ========== 11. PROTECTION CONTRE LE CLIC DROIT (optionnel) ==========

// Décommenter si tu veux empêcher le clic droit sur les images
// document.addEventListener('contextmenu', (e) => {
//   if (e.target.tagName === 'IMG') {
//     e.preventDefault();
//     console.log('Protection des images activée 🔒');
//   }
// });

// ========== 12. EASTER EGG - KONAMI CODE (optionnel fun) ==========

// Séquence secrète : ↑ ↑ ↓ ↓ ← → ← → B A
let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join("") === konamiSequence.join("")) {
    // Easter egg activé !
    document.body.style.animation = "rainbow 2s infinite";
    console.log("🎉 KONAMI CODE ACTIVÉ ! Tu es un vrai geek ! 🎮");

    // Ajoute l'animation rainbow
    const style = document.createElement("style");
    style.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    // Désactive après 5 secondes
    setTimeout(() => {
      document.body.style.animation = "";
    }, 5000);
  }
});

// ========== 13. INIT - AU CHARGEMENT DE LA PAGE ==========

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Portfolio chargé avec succès !");

  // Ajoute la classe fade-in aux éléments du hero
  const heroElements = document.querySelectorAll(".hero-content > *");
  heroElements.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "all 0.6s ease-out";

      setTimeout(() => {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, 100);
    }, index * 150);
  });
});

// ========== FIN DU SCRIPT ==========
