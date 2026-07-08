document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFadeInOnScroll();
  initFooterYear();
  initEnquiryForm();
});

/* ===================== Mobile nav toggle ===================== */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

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
  yearEl.textContent = new Date().getFullYear();
}

/* ===================== Enquiry form ===================== */
function initEnquiryForm() {
  const form = document.getElementById('enquiryForm');
  const successMessage = document.getElementById('formSuccess');

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
      return;
    }

    const data = {
      fullName: form.elements.fullName.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      preferredDate: form.elements.preferredDate.value,
      message: form.elements.message.value.trim(),
    };

    // TODO: replace with a real API call, e.g.
    // fetch('/api/appointments', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    console.log('Appointment request submitted:', data);

    successMessage.hidden = false;
    form.reset();
    Object.values(fields).forEach(({ input, error }) => {
      error.textContent = '';
      input.setAttribute('aria-invalid', 'false');
    });
  });
}
