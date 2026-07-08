document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFadeInOnScroll();
  initFooterYear();
  initEnquiryForm();
  initStatCounters();
  initWhatsAppWidget();
});

/* ===================== Mobile nav toggle ===================== */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ===================== Fade-in on scroll ===================== */
function initFadeInOnScroll() {
  const targets = document.querySelectorAll('.fade-in');

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ===================== Footer year ===================== */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
}

/* ===================== Trust-strip stat count-up ===================== */
function initStatCounters() {
  const targets = document.querySelectorAll('.trust-number');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!targets.length || prefersReducedMotion || !('IntersectionObserver' in window)) {
    return;
  }

  const animate = (el) => {
    const match = el.textContent.match(/^([\d,]+)(.*)$/);
    if (!match) return;

    const target = parseInt(match[1].replace(/,/g, ''), 10);
    const suffix = match[2];
    const hasCommas = match[1].includes(',');
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = (hasCommas ? value.toLocaleString('en-US') : String(value)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ===================== Enquiry form ===================== */
function initEnquiryForm() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  const successMessage = document.getElementById('formSuccess');
  const errorMessage = document.getElementById('formError');
  const submitButton = form.querySelector('.form-submit');

  const fields = {
    fullName: {
      input: form.elements.fullName,
      error: document.getElementById('fullNameError'),
      validate: (value) => (value.trim() ? '' : 'Please enter your full name.'),
    },
    email: {
      input: form.elements.email,
      error: document.getElementById('emailError'),
      validate: (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'Please enter your email address.';
        if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      },
    },
    phone: {
      input: form.elements.phone,
      error: document.getElementById('phoneError'),
      validate: (value) => {
        const phonePattern = /^[0-9+()\-.\s]{7,}$/;
        if (!value.trim()) return 'Please enter your phone number.';
        if (!phonePattern.test(value.trim())) return 'Please enter a valid phone number.';
        return '';
      },
    },
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let firstInvalidInput = null;

    Object.values(fields).forEach(({ input, error, validate }) => {
      const message = validate(input.value);
      error.textContent = message;
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (message && !firstInvalidInput) {
        firstInvalidInput = input;
      }
    });

    if (firstInvalidInput) {
      firstInvalidInput.focus();
      successMessage.hidden = true;
      errorMessage.hidden = true;
      return;
    }

    successMessage.hidden = true;
    errorMessage.hidden = true;
    submitButton.disabled = true;

    fetch('https://formspree.io/f/xgojbljq', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Formspree request failed');

        successMessage.hidden = false;
        form.reset();
        Object.values(fields).forEach(({ input, error }) => {
          error.textContent = '';
          input.setAttribute('aria-invalid', 'false');
        });
        celebrateSubmission();
      })
      .catch(() => {
        errorMessage.hidden = false;
      })
      .finally(() => {
        submitButton.disabled = false;
      });
  });
}

/* ===================== Post-submit celebration (voice + balloons) ===================== */
function celebrateSubmission() {
  speakThankYou();
  launchBalloons();
}

function speakThankYou() {
  if (!('speechSynthesis' in window)) return;

  const utterance = new SpeechSynthesisUtterance(
    'Hurray, thank you for submission. We will get back in 3 business days.'
  );
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function launchBalloons() {
  const container = document.getElementById('balloonContainer');
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const colors = ['#c8913f', '#e0b06e', '#10263d', '#256b3e', '#9a3324'];

  for (let i = 0; i < 10; i++) {
    const balloon = document.createElement('span');
    balloon.className = 'balloon';
    balloon.style.left = `${Math.random() * 90 + 2}%`;
    balloon.style.background = colors[i % colors.length];
    balloon.style.animationDelay = `${(Math.random() * 0.6).toFixed(2)}s`;
    balloon.style.setProperty('--drift', `${Math.round(Math.random() * 80 - 40)}px`);
    balloon.addEventListener('animationend', () => balloon.remove());
    container.appendChild(balloon);
  }
}

/* ===================== WhatsApp chat widget ===================== */
function initWhatsAppWidget() {
  const button = document.getElementById('waButton');
  const panel = document.getElementById('waPanel');
  const closeButton = document.getElementById('waPanelClose');

  if (!button || !panel || !closeButton) return;

  const widget = button.closest('.wa-widget');

  const closePanel = () => {
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  };

  const openPanel = () => {
    panel.hidden = false;
    button.setAttribute('aria-expanded', 'true');
  };

  button.addEventListener('click', () => {
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  });

  closeButton.addEventListener('click', closePanel);

  document.addEventListener('click', (e) => {
    if (!panel.hidden && !widget.contains(e.target)) {
      closePanel();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      closePanel();
      button.focus();
    }
  });
}
