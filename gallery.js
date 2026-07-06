// Castlegar HandyMan — Gallery grid + lightbox
document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('galleryGrid');
  var photos = (typeof GALLERY_PHOTOS !== 'undefined') ? GALLERY_PHOTOS : [];

  if (!grid || !photos.length) return;

  // Build grid from gallery-data.js
  photos.forEach(function (photo, index) {
    var btn = document.createElement('button');
    btn.className = 'gallery-item';
    btn.setAttribute('data-index', index);
    btn.setAttribute('aria-label', 'Open photo: ' + (photo.caption || 'Project photo'));

    var img = document.createElement('img');
    img.src = 'gallery/' + photo.file;
    img.alt = photo.caption || 'Castlegar HandyMan project photo';
    img.loading = 'lazy';

    btn.appendChild(img);
    grid.appendChild(btn);
  });

  // Lightbox
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    var photo = photos[currentIndex];
    lightboxImg.src = 'gallery/' + photo.file;
    lightboxImg.alt = photo.caption || '';
    lightboxCaption.textContent = photo.caption || '';
  }

  function showNext() { currentIndex = (currentIndex + 1) % photos.length; updateLightboxImage(); }
  function showPrev() { currentIndex = (currentIndex - 1 + photos.length) % photos.length; updateLightboxImage(); }

  grid.addEventListener('click', function (e) {
    var item = e.target.closest('.gallery-item');
    if (!item) return;
    openLightbox(parseInt(item.getAttribute('data-index'), 10));
  });

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Basic touch swipe support
  var touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    var diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) { diff > 0 ? showPrev() : showNext(); }
  }, { passive: true });
});
