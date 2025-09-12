document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.toggle-switch input');
  const handle = document.querySelector('.toggle-switch-handle');
  const background = document.querySelector('.toggle-switch-background');

  const isDark = sessionStorage.getItem('darkMode') === 'true';

  toggle.checked = isDark;
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('dark-mode-static');
  });

  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;

    sessionStorage.setItem('darkMode', enabled);
    document.documentElement.classList.toggle('dark-mode', enabled);

    document.documentElement.classList.remove('dark-mode-static');
  });
});


function createScrambleEffect(element, autoStart = false) {
  const TARGET_TEXT = element.dataset.text;
  const CYCLES_PER_LETTER = 2;
  const SHUFFLE_TIME = 38;
  const CHARS = [...new Set(TARGET_TEXT.replace(/\s/g, '').split(''))];
  let interval = null;

  // Add invisible clone to lock width (once)
  if (!element.classList.contains('scramble-initialized')) {
    const clone = document.createElement('span');
    clone.textContent = TARGET_TEXT;
    clone.style.visibility = 'hidden';
    clone.style.height = '0';
    clone.style.overflow = 'hidden';
    clone.style.display = 'block';
    clone.style.position = 'absolute';
    clone.style.pointerEvents = 'none';
    clone.style.userSelect = 'none';
    clone.style.fontFamily = getComputedStyle(element).fontFamily;
    clone.classList.add('scramble-clone');
    element.appendChild(clone);
    element.classList.add('scramble-initialized');
    element.style.display = 'inline-block';
    element.style.position = 'relative';
  }

  function scramble() {
    let pos = 0;
    clearInterval(interval);

    interval = setInterval(() => {
      const scrambled = TARGET_TEXT.split("").map((char, index) => {
        if (index === 0) return char;
        if (pos / CYCLES_PER_LETTER > index) return char;
        return char === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");

      element.firstChild.textContent = scrambled; // update only main text node
      pos++;

      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
        clearInterval(interval);
        element.firstChild.textContent = TARGET_TEXT;
      }
    }, SHUFFLE_TIME);
  }

  if (autoStart) {
    setTimeout(scramble, 100);
  } else {
    element.addEventListener("mouseenter", scramble);
    element.addEventListener("mouseleave", () => {
      clearInterval(interval);
      element.firstChild.textContent = TARGET_TEXT;
    });
  }
}


// Initialize hover scramble texts
document.querySelectorAll('.scramble-text').forEach(element => {
  createScrambleEffect(element, false);
});

// Initialize auto scramble texts
document.querySelectorAll('.scramble-auto').forEach(element => {
  createScrambleEffect(element, true);
});




function scrambleText(element, newText) {
  const CYCLES_PER_LETTER = 2;
  const SHUFFLE_TIME = 38;
  const CHARS = [...new Set(newText.replace(/\s/g, '').split(''))];

  let pos = 0;
  let interval = null;

  clearInterval(interval);

  // Show full time immediately
  element.textContent = newText;

  const firstDigitIndex = newText.search(/\d/);

  setTimeout(() => {
    interval = setInterval(() => {
      const scrambled = newText.split("").map((char, index) => {
        if (index === firstDigitIndex) return char;
        if (pos / CYCLES_PER_LETTER > index) return char;
        return char === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");

      element.textContent = scrambled;
      pos++;

      if (pos >= newText.length * CYCLES_PER_LETTER) {
        clearInterval(interval);
        element.textContent = newText;
      }
    }, SHUFFLE_TIME);
  }, 30);
}

function updatePSTTime(doScramble = false) {
  const element = document.getElementById("pst-time");
  const now = new Date();

  const options = {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  };

  const pstTime = now.toLocaleTimeString("en-US", options);
  const displayText = `${pstTime} PST`;

  element.dataset.text = displayText;

  if (doScramble) {
    scrambleText(element, displayText); // Only scramble once
  } else {
    element.textContent = displayText;  // Just update silently
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updatePSTTime(true); // Initial with scramble
  setInterval(() => updatePSTTime(false), 60000); // No scramble on updates
});



// Auto-close any open offcanvas when resizing to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    const openOffcanvas = document.querySelector('.offcanvas.show');
    if (openOffcanvas) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(openOffcanvas);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    }
  }
});



document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll(".work-card video");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play();
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 1 }); // 0.5 = play when 50% visible

  videos.forEach(video => observer.observe(video));
});






