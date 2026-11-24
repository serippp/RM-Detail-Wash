(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 30);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open', !open);
  });

  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  document.querySelectorAll('[data-compare]').forEach((compare) => {
    const slider = compare.querySelector('input[type="range"]');
    slider?.addEventListener('input', () => compare.style.setProperty('--split', `${slider.value}%`));
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
  }

  const galleryVideos = document.querySelectorAll('.gallery-item video');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.play().catch(() => {});
        else entry.target.pause();
      });
    }, { threshold: 0.55 });
    galleryVideos.forEach((video) => videoObserver.observe(video));
  }

  const form = document.querySelector('#quote-form');
  const formStatus = document.querySelector('#form-status');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus.textContent = 'Demonstração concluída: nenhum dado foi enviado. Contacte a RM Detail Wash pelo 918 716 696 ou pelo Instagram.';
    formStatus.focus?.();
  });

  const dialog = document.querySelector('#lightbox');
  const dialogContent = dialog?.querySelector('.lightbox-content');
  const closeButton = dialog?.querySelector('.lightbox-close');

  const closeLightbox = () => {
    dialog?.querySelector('video')?.pause();
    dialog?.close();
    if (dialogContent) dialogContent.innerHTML = '';
    document.body.classList.remove('lightbox-open');
  };

  document.querySelectorAll('[data-lightbox-image], [data-lightbox-video]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!dialog || !dialogContent) return;

      if (button.dataset.lightboxImage) {
        const image = document.createElement('img');
        image.src = button.dataset.lightboxImage;
        image.alt = button.querySelector('img')?.alt || 'Trabalho RM Detail Wash';
        dialogContent.append(image);
      } else if (button.dataset.lightboxVideo) {
        const video = document.createElement('video');
        video.src = button.dataset.lightboxVideo;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        dialogContent.append(video);
      }

      document.body.classList.add('lightbox-open');
      dialog.showModal();
    });
  });

  closeButton?.addEventListener('click', closeLightbox);
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog || event.target === dialogContent) closeLightbox();
  });
  dialog?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeLightbox();
  });

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
