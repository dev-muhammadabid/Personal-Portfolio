// ═══════════════════════════════════════════════════════════════
// PRELOADER
// ═══════════════════════════════════════════════════════════════
const loader = document.getElementById("preloader");
window.addEventListener("load", function () {
  setTimeout(() => {
    loader.style.display = "none";
  }, 800);
});

// ═══════════════════════════════════════════════════════════════
// CURSOR GLOW EFFECT (mouse/desktop only)
// ═══════════════════════════════════════════════════════════════
const cursorGlow = document.getElementById("cursorGlow");
const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

if (!isTouch && cursorGlow) {
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    cursorGlow.style.left = glowX + "px";
    cursorGlow.style.top  = glowY + "px";
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
} else if (cursorGlow) {
  cursorGlow.style.display = "none";
}

// ═══════════════════════════════════════════════════════════════
// NAVBAR SCROLL EFFECT
// ═══════════════════════════════════════════════════════════════
const navbar = document.getElementById("navbar");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 80) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  
  lastScroll = currentScroll;
});

// ═══════════════════════════════════════════════════════════════
// HAMBURGER MENU TOGGLE
// ═══════════════════════════════════════════════════════════════
const toggleBtn = document.querySelector(".navbar_menu");
const dropDownMenu = document.querySelector(".dropdown_menu");

if (toggleBtn && dropDownMenu) {
  toggleBtn.addEventListener("click", () => {
    dropDownMenu.classList.toggle("open");
    toggleBtn.classList.toggle("open");
  });

  // Close dropdown when clicking a link
  const dropdownLinks = dropDownMenu.querySelectorAll("a");
  dropdownLinks.forEach(link => {
    link.addEventListener("click", () => {
      dropDownMenu.classList.remove("open");
      toggleBtn.classList.remove("open");
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!toggleBtn.contains(e.target) && !dropDownMenu.contains(e.target)) {
      dropDownMenu.classList.remove("open");
      toggleBtn.classList.remove("open");
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// INTRO NAME FONT ANIMATION (Michroma ↔ Silkscreen)
// ═══════════════════════════════════════════════════════════════
const fonts = ["Michroma", "Silkscreen"];
const nameElement = document.getElementById("abii");
let currentIndex = 0;

function changeFont() {
  if (nameElement) {
    nameElement.style.fontFamily = fonts[currentIndex];
    currentIndex = (currentIndex + 1) % fonts.length;
  }
}

setInterval(changeFont, 1000);

// ═══════════════════════════════════════════════════════════════
// SCROLL REVEAL ANIMATIONS
// ═══════════════════════════════════════════════════════════════
const revealElements = document.querySelectorAll(
  ".reveal-up, .reveal-left, .reveal-right"
);

// If user prefers reduced motion, show everything immediately
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealElements.forEach((el) => el.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );
  revealElements.forEach((el) => revealObserver.observe(el));
}

// ═══════════════════════════════════════════════════════════════
// PROJECT CARD TILT EFFECT (Subtle 3D — desktop/mouse only)
// ═══════════════════════════════════════════════════════════════
const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const projectCards = document.querySelectorAll("[data-tilt]");

if (!isTouchDevice && !prefersReducedMotion) {
  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// SMOOTH SCROLL FOR ANCHOR LINKS
// ═══════════════════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && href !== "") {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// CONTACT FORM HANDLING
// ═══════════════════════════════════════════════════════════════
function sendEmail() {
  const name = document.getElementById("contact_name").value.trim();
  const email = document.getElementById("contact_email").value.trim();
  const number = document.getElementById("contact_number").value.trim();
  const message = document.getElementById("contact_message")?.value.trim() || "";
  
  // Basic validation
  if (!name || !email) {
    alert("Please fill in your name and email.");
    return false;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }
  
  const btn = document.getElementById("contact_btn");
  const btnText = document.getElementById("btn-text");
  
  // Disable button during send
  btn.disabled = true;
  btnText.textContent = "Sending...";
  
  // Send email using SMTP.js
  Email.send({
    SecureToken: "1718C80D7F6D3516282BC04D0EC341F5F788",
    To: "mail.muhammadabid@gmail.com",
    From: "muhammadabid.dev@gmail.com",
    Subject: "New Contact Form Submission",
    Body: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${number || "Not provided"}</p>
      <p><strong>Message:</strong> ${message || "No message provided"}</p>
    `,
  })
    .then((response) => {
      if (response === "OK") {
        alert("✅ Thank you! Your message has been sent successfully.");
        document.getElementById("contactForm").reset();
      } else {
        alert("⚠️ Something went wrong. Please try again or email me directly.");
      }
    })
    .catch((error) => {
      console.error("Email error:", error);
      alert("⚠️ Failed to send message. Please email me directly at mail.muhammadabid@gmail.com");
    })
    .finally(() => {
      btn.disabled = false;
      btnText.textContent = "Send Message";
    });
  
  return false;
}

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE: LAZY LOAD IMAGES
// ═══════════════════════════════════════════════════════════════
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// ═══════════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION ACCESSIBILITY
// ═══════════════════════════════════════════════════════════════
if (toggleBtn) {
  toggleBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleBtn.click();
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// CONSOLE EASTER EGG
// ═══════════════════════════════════════════════════════════════
console.log(
  "%c👋 Hey there, curious developer!",
  "color: #40C057; font-size: 20px; font-weight: bold; font-family: 'Silkscreen', monospace;"
);
console.log(
  "%cLooking for something? Let's connect! 🚀\nEmail: mail.muhammadabid@gmail.com\nGitHub: github.com/dev-muhammadabid",
  "color: #e6f1ff; font-size: 14px; font-family: 'Michroma', sans-serif; line-height: 1.6;"
);
