/* ==========================================================================
   ANIMATED SCRAPBOOK GIFT - INTERACTIVE JAVASCRIPT (7 SLIDES TEMPLATE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const stageGift = document.getElementById('stageGift');
  const stageScrapbook = document.getElementById('stageScrapbook');
  const giftBox = document.getElementById('giftBox');
  const btnOpenGift = document.getElementById('btnOpenGift');
  const boxBurst = document.getElementById('boxBurst');

  // Background Audio Element (Requirement #5: Autoplay without visible audio buttons)
  const backgroundMusic = document.getElementById('backgroundMusic');

  // Scrapbook 7 Slides Navigation Elements
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const pageIndicator = document.getElementById('pageIndicator');
  const pages = document.querySelectorAll('.scrapbook-page');
  const replayBtn = document.getElementById('replayBtn');

  // Interactive Slide 4 Features
  const flipContainers = document.querySelectorAll('.polaroid-flip-container');
  const stickerBtns = document.querySelectorAll('.sticker-select-btn');
  const stickerLayer = document.getElementById('stickerLayer');
  const clearStickersBtn = document.getElementById('clearStickersBtn');

  let currentPage = 1;
  const totalPages = pages.length; // EXACTLY 7 SLIDES
  let isMusicStarted = false;
  let activeStickerType = 'heart';

  // Transparent PNG sticker assets mapping
  const stickerAssets = {
    heart: 'assets/scrapbook/sticker_heart.png',
    star: 'assets/scrapbook/sticker_star.png',
    flower: 'assets/scrapbook/flower_sticker.png',
    stamp: 'assets/scrapbook/sticker_stamp.png',
    ribbon: 'assets/scrapbook/sticker_ribbon.png'
  };


  /* ==========================================================================
     1. AMBIENT SPARKLES GENERATOR
     ========================================================================== */
  function initSparkles() {
    const sparklesContainer = document.getElementById('sparkles');
    if (!sparklesContainer) return;
    const sparkleCount = 35;

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.classList.add('sparkle');
      
      const size = Math.random() * 4 + 2;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
      sparkle.style.animationDelay = `${Math.random() * 3}s`;

      sparklesContainer.appendChild(sparkle);
    }
  }

  initSparkles();


  /* ==========================================================================
     2. BACKGROUND AUDIO AUTOPLAY & INTERACTION FALLBACK (REQUIREMENT #5)
     ========================================================================== */
  function startBackgroundAudio() {
    if (backgroundMusic && !isMusicStarted) {
      backgroundMusic.volume = 0.6; // Comfortable volume
      const playPromise = backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isMusicStarted = true;
          console.log('Background music autoplay started successfully.');
        }).catch(err => {
          console.log('Autoplay prevented by browser safety policy, waiting for user click:', err);
        });
      }
    }
  }

  // Attempt autoplay immediately on window load
  startBackgroundAudio();

  // Also start on any early document interaction as browser safety fallback
  document.addEventListener('click', () => {
    startBackgroundAudio();
  }, { once: true });


  /* ==========================================================================
     3. STAGE 1: 3D GIFT BOX OPENING ANIMATION (VIDEO 2 REFERENCE)
     ========================================================================== */
  function createBurstParticles() {
    if (!boxBurst) return;
    boxBurst.innerHTML = '';
    const colors = ['#FFD700', '#FF758C', '#FFF', '#FF9EAA', '#E2A7B4'];

    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.classList.add('burst-particle');
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 180 + 60;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);

      boxBurst.appendChild(particle);
    }
  }

  function openGiftBox() {
    // 1. Play Background Music if not already started
    startBackgroundAudio();

    // 2. Trigger Gift Box Lid Opening & Particle Explosion
    giftBox.classList.add('opening');
    createBurstParticles();

    // 3. Smooth Transition to Stage 2 (Scrapbook Album)
    setTimeout(() => {
      stageGift.classList.add('hidden');
      stageScrapbook.classList.remove('hidden');
      updatePageVisibility(1);
    }, 900);
  }

  if (giftBox) giftBox.addEventListener('click', openGiftBox);
  if (btnOpenGift) btnOpenGift.addEventListener('click', openGiftBox);


  /* ==========================================================================
     4. 7 SLIDES SCRAPBOOK NAVIGATION SYSTEM (REQUIREMENTS #3 & #4)
     ========================================================================== */
  function updatePageVisibility(pageNumber) {
    pages.forEach(page => {
      const pNum = parseInt(page.getAttribute('data-page'));
      if (pNum === pageNumber) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    currentPage = pageNumber;

    // Format Page Indicator as "01 / 07", "02 / 07", ... "07 / 07"
    const formattedCurrent = String(currentPage).padStart(2, '0');
    const formattedTotal = String(totalPages).padStart(2, '0');
    if (pageIndicator) {
      pageIndicator.textContent = `${formattedCurrent} / ${formattedTotal}`;
    }

    // Update Previous & Next Buttons State
    if (prevPageBtn) {
      prevPageBtn.disabled = (currentPage === 1);
    }

    if (nextPageBtn) {
      if (currentPage === totalPages) {
        nextPageBtn.disabled = true;
        nextPageBtn.textContent = 'Selesai ✨';
      } else {
        nextPageBtn.disabled = false;
        nextPageBtn.textContent = 'Selanjutnya ›';
      }
    }
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        updatePageVisibility(currentPage + 1);
      }
    });
  }

  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        updatePageVisibility(currentPage - 1);
      }
    });
  }

  // Keyboard Arrow Key Navigation Support
  document.addEventListener('keydown', (e) => {
    if (stageScrapbook.classList.contains('hidden')) return;
    
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      if (currentPage < totalPages) updatePageVisibility(currentPage + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      if (currentPage > 1) updatePageVisibility(currentPage - 1);
    }
  });

  // Touch Swipe Navigation Support on Mobile Devices
  let touchStartX = 0;
  let touchEndX = 0;

  const scrapbookBook = document.getElementById('scrapbookBook');
  if (scrapbookBook) {
    scrapbookBook.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    scrapbookBook.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 40) {
      if (swipeDistance < 0 && currentPage < totalPages) {
        // Swipe Left -> Next Slide
        updatePageVisibility(currentPage + 1);
      } else if (swipeDistance > 0 && currentPage > 1) {
        // Swipe Right -> Previous Slide
        updatePageVisibility(currentPage - 1);
      }
    }
  }

  // Replay Button (Return to 3D Gift Box Stage)
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      giftBox.classList.remove('opening');
      stageScrapbook.classList.add('hidden');
      stageGift.classList.remove('hidden');
      updatePageVisibility(1);
    });
  }


  /* ==========================================================================
     5. SLIDE 4 INTERACTIVE FEATURES: FLIP POLAROIDS & STICKER PLAYGROUND
     ========================================================================== */
  // Flip Polaroid Cards
  flipContainers.forEach(container => {
    container.addEventListener('click', (e) => {
      e.stopPropagation();
      container.classList.toggle('flipped');
    });
  });

  // Sticker Selector Toolbar
  stickerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      stickerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStickerType = btn.getAttribute('data-sticker');
    });
  });

  // Click on Slide 4 canvas to drop interactive sticker
  const page4 = document.querySelector('.page-4');
  if (page4) {
    page4.addEventListener('click', (e) => {
      if (e.target.closest('.polaroid-flip-container') || e.target.closest('.sticker-toolbar')) {
        return;
      }

      const rect = page4.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      dropSticker(x, y, activeStickerType);
    });
  }

  function dropSticker(x, y, type) {
    if (!stickerLayer) return;
    const stickerImg = document.createElement('img');
    stickerImg.src = stickerAssets[type] || stickerAssets.heart;
    stickerImg.classList.add('dropped-sticker');

    const randomRot = (Math.random() - 0.5) * 40;
    const size = 55 + Math.random() * 25;

    stickerImg.style.width = `${size}px`;
    stickerImg.style.height = 'auto';
    stickerImg.style.left = `${x - size / 2}px`;
    stickerImg.style.top = `${y - size / 2}px`;
    stickerImg.style.setProperty('--rot', `${randomRot}deg`);

    stickerLayer.appendChild(stickerImg);
  }

  // Clear Stickers Button
  if (clearStickersBtn) {
    clearStickersBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (stickerLayer) stickerLayer.innerHTML = '';
    });
  }

});
