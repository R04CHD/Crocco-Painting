const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('open', !expanded);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  nav.classList.remove('open');
}));

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.filter.active')?.classList.remove('active');
  button.classList.add('active');
  const filter = button.dataset.filter;
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.hidden = filter !== 'all' && item.dataset.category !== filter;
  });
}));

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => {
  lightboxImage.src = item.dataset.image;
  lightboxImage.alt = item.querySelector('img').alt;
  lightbox.showModal();
}));
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

const quoteForm = document.querySelector('#quote-form');
quoteForm.addEventListener('submit', async event => {
  event.preventDefault();
  const submitButton = quoteForm.querySelector('button[type="submit"]');
  const formStatus = document.querySelector('#form-status');
  submitButton.disabled = true;
  formStatus.textContent = 'Sending your enquiry...';

  try {
    const response = await fetch(quoteForm.action, {
      method: quoteForm.method,
      body: new FormData(quoteForm),
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      formStatus.textContent = 'We could not send your enquiry. Please try again.';
      submitButton.disabled = false;
      return;
    }

    window.location.assign('thank-you.html');
  } catch {
    formStatus.textContent = 'We could not send your enquiry. Please try again.';
    submitButton.disabled = false;
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
