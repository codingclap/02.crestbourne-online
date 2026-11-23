/**
 * Crestbourne Properties LLC - Core Navigation & Hero Interactions
 */
document.addEventListener('DOMContentLoaded', () => {
  const DESKTOP_BREAKPOINT = 992;

  const siteHeader = document.getElementById('siteHeader');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const primaryNavMenu = document.getElementById('primaryNavMenu');
  const dropdownItems = document.querySelectorAll('[data-dropdown]');

  /* ------------------------------------------------------------------------
     1. Sticky Header Scroll State
  ------------------------------------------------------------------------ */
  const handleHeaderScroll = () => {
    if (!siteHeader) return;
    siteHeader.classList.toggle('site-header--scrolled', window.scrollY > 24);
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ------------------------------------------------------------------------
     2. Mobile Navigation Drawer Toggle
  ------------------------------------------------------------------------ */
  const setMobileMenuState = (isOpen) => {
    if (!mobileMenuToggle || !primaryNavMenu) return;

    mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
    primaryNavMenu.classList.toggle('site-navigation__menu--open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (!isOpen) {
      closeAllDropdowns();
    }
  };

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      const isCurrentlyOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      setMobileMenuState(!isCurrentlyOpen);
    });
  }

  /* ------------------------------------------------------------------------
     3. Accessible Properties Dropdown (Hover on Desktop + Click & Keyboard)
  ------------------------------------------------------------------------ */
  const setDropdownState = (item, isOpen) => {
    const trigger = item.querySelector('.site-navigation__dropdown-trigger');
    item.classList.toggle('site-navigation__item--open', isOpen);
    if (trigger) {
      trigger.setAttribute('aria-expanded', String(isOpen));
    }
  };

  const closeAllDropdowns = (exceptItem = null) => {
    dropdownItems.forEach((item) => {
      if (item !== exceptItem) {
        setDropdownState(item, false);
      }
    });
  };

  dropdownItems.forEach((item) => {
    const trigger = item.querySelector('.site-navigation__dropdown-trigger');
    const menu = item.querySelector('.site-navigation__dropdown');
    const links = menu ? Array.from(menu.querySelectorAll('a')) : [];

    // Desktop Hover Behavior
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        closeAllDropdowns(item);
        setDropdownState(item, true);
      }
    });

    item.addEventListener('mouseleave', () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        setDropdownState(item, false);
      }
    });

    // Click / Tap Behavior (Desktop & Mobile)
    if (trigger) {
      trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = item.classList.contains('site-navigation__item--open');
        closeAllDropdowns(item);
        setDropdownState(item, !isOpen);
      });

      // Keyboard Support on Trigger
      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setDropdownState(item, true);
          if (links.length > 0) links[0].focus();
        } else if (event.key === 'Escape') {
          setDropdownState(item, false);
          trigger.focus();
        }
      });
    }

    // Keyboard Navigation Inside Submenu
    links.forEach((link, index) => {
      link.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          setDropdownState(item, false);
          if (trigger) trigger.focus();
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          const nextIndex = (index + 1) % links.length;
          links[nextIndex].focus();
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          const prevIndex = (index - 1 + links.length) % links.length;
          links[prevIndex].focus();
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     4. Click Outside & Escape Key Global Handlers
  ------------------------------------------------------------------------ */
  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-dropdown]')) {
      closeAllDropdowns();
    }

    if (
      primaryNavMenu &&
      primaryNavMenu.classList.contains('site-navigation__menu--open') &&
      !event.target.closest('#primaryNavMenu') &&
      !event.target.closest('#mobileMenuToggle')
    ) {
      setMobileMenuState(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllDropdowns();
      if (primaryNavMenu && primaryNavMenu.classList.contains('site-navigation__menu--open')) {
        setMobileMenuState(false);
        if (mobileMenuToggle) mobileMenuToggle.focus();
      }
      closeVideoModal();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= DESKTOP_BREAKPOINT) {
      setMobileMenuState(false);
    }
  });

  /* ------------------------------------------------------------------------
     5. Hero Video Pill Lightbox
  ------------------------------------------------------------------------ */
  const videoTrigger = document.getElementById('heroVideoTrigger');
  const videoLightbox = document.getElementById('videoLightbox');
  const closeVideoBtn = document.getElementById('closeVideoLightbox');
  const videoPlayer = document.getElementById('showcaseVideoPlayer');
  const backdropClosers = document.querySelectorAll('[data-close-lightbox]');

  const openVideoModal = () => {
    if (!videoLightbox || !videoTrigger || !videoPlayer) return;
    const videoSrc = videoTrigger.getAttribute('data-video-src');
    if (videoSrc) {
      videoPlayer.src = videoSrc;
    }
    videoLightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    videoPlayer.play().catch(() => {});
    if (closeVideoBtn) closeVideoBtn.focus();
  };

  function closeVideoModal() {
    if (!videoLightbox || videoLightbox.hidden) return;
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.removeAttribute('src');
      videoPlayer.load();
    }
    videoLightbox.hidden = true;
    document.body.style.overflow = '';
    if (videoTrigger) videoTrigger.focus();
  }

  if (videoTrigger) {
    videoTrigger.addEventListener('click', openVideoModal);
  }

  if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', closeVideoModal);
  }

  backdropClosers.forEach((el) => {
    el.addEventListener('click', closeVideoModal);
  });
});