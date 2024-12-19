document.addEventListener('DOMContentLoaded', () => {

// Cache DOM elements
  const tabItems = document.querySelectorAll('.hover-tabs_list-item');
  const tabImages = document.querySelectorAll('.hover-tabs_image');
  const masks = document.querySelectorAll('.hover-tabs_item-more-mask');
  const mobileImageMasks = document.querySelectorAll('.hover-tabs_mobile-image-mask');
  
  // Helper function to apply styles to an element
  function setStyle(element, styles) {
    for (const property in styles) {
      element.style[property] = styles[property];
    }
  }

  // Helper function to transition styles
  function transitionStyle(element, styles, duration, easing) {
    element.style.transition = `all ${duration}ms ${easing}`;
    setStyle(element, styles);

    // Remove transition after it's complete
    setTimeout(() => {
      element.style.transition = '';
    }, duration);
  }

  // Ensure all masks are closed when the page loads
  masks.forEach((mask) => {
    setStyle(mask, { height: '0px' });
  });

  mobileImageMasks.forEach((mobileImageMask) => {
    setStyle(mobileImageMask, { height: '0px' });
  });

  // Open the first mask and its corresponding mobile image mask when the page loads
  if (masks.length > 0) {
    setStyle(masks[0], { height: 'auto' });
  }
  if (mobileImageMasks.length > 0) {
    setStyle(mobileImageMasks[0], { height: 'auto' });
  }

  // Tab hover functionality
  tabItems.forEach((item, index) => {
    const mask = item.querySelector('.hover-tabs_item-more-mask');
    const mobileImageMask = item.parentNode.querySelector('.hover-tabs_mobile-image-mask');
    let isMobileOpen = false;

    // Desktop hover handlers
    item.addEventListener('mouseover', () => {
      if (window.innerWidth >= 992) {
        // Update tab states
        tabItems.forEach(tab => tab.classList.remove('is-active'));
        tabImages.forEach(image => image.classList.remove('is-active'));
        
        item.classList.add('is-active');
        tabImages[index]?.classList.add('is-active');

        // Handle mask animation
        if (mask) {
          setStyle(mask, { height: '0rem' });
          transitionStyle(mask, { height: 'auto' }, 250, 'ease-in-out');
        }
      }
    });

    item.addEventListener('mouseout', () => {
      if (window.innerWidth >= 992 && mask) {
        transitionStyle(mask, { height: '0px' }, 250, 'ease-in-out');
      }
    });

    // Mobile click handler
    item.addEventListener('click', (event) => {
      if (window.innerWidth < 992 && mask && mobileImageMask) {
        // Prevent event bubbling to avoid triggering other interactions
        event.stopPropagation();
        isMobileOpen = !isMobileOpen;
        const transitionConfig = isMobileOpen ? 
          { duration: 400, height: 'auto' } : 
          { duration: 400, height: '0px' };

        [mask, mobileImageMask].forEach(element => {
          transitionStyle(element, { height: transitionConfig.height }, transitionConfig.duration, 'ease-in-out');
        });
      }
    });
  });
  
  // Scroll Progress functionality for desktop
  if (window.innerWidth > 991) {
    const scrollProgress = {
      currentScrollPercent: 0,
      
      init() {
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll());
      },

      handleScroll() {
        const scroller = document.querySelector('.cards-scroller');
        const leftHalf = document.querySelector('.card-half.left');
        const rightHalf = document.querySelector('.card-half.right');

        if (!scroller || !leftHalf || !rightHalf) return;

        const targetScrollPercent = this.getScrollProgress(scroller);
        this.currentScrollPercent = this.lerp(
          this.currentScrollPercent, 
          targetScrollPercent, 
          0.12
        );

        this.updateHalfPositions(leftHalf, rightHalf);
        requestAnimationFrame(() => this.handleScroll());
      },

      updateHalfPositions(leftHalf, rightHalf) {
        const scroll = this.currentScrollPercent;
        
        if (scroll >= 70) {
          this.updateTransform(leftHalf, -66.67);
          this.updateTransform(rightHalf, 0);
        } else if (scroll >= 50) {
          this.updateTransform(leftHalf, -33.33);
          this.updateTransform(rightHalf, -33.33);
        } else if (scroll >= 40) {
          this.updateTransform(leftHalf, -33.33);
          this.updateTransform(rightHalf, -33.33);
        } else if (scroll >= 20) {
          this.updateTransform(leftHalf, 0);
          this.updateTransform(rightHalf, -66.67);
        }
      },

      lerp(start, end, factor) {
        return start * (1 - factor) + end * factor;
      },

      getScrollProgress(element) {
        const rect = element.getBoundingClientRect();
        return ((window.innerHeight - rect.top) / 
                (rect.height + window.innerHeight)) * 100;
      },

      updateTransform(element, value) {
        if (element) {
          element.style.transition = 'transform 0.5s ease';
          element.style.transform = `translateY(${value}%)`;
        }
      }
    };

    scrollProgress.init();
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const contentSection = document.querySelector('.content-section');
    const background = document.querySelector('.content-background');
    const textWrappers = document.querySelectorAll('.content-text-wrapper');
    
    // Aktifkan section pertama saat halaman dimuat
    textWrappers[0].classList.add('active');
    
    function updateScroll() {
        const scrollPercent = (window.scrollY - contentSection.offsetTop) / (contentSection.offsetHeight - window.innerHeight) * 100;
        
        // Background parallax and opacity
        if (scrollPercent >= 0 && scrollPercent <= 100) {
            background.style.opacity = scrollPercent >= 30 && scrollPercent <= 70 ? '1' : '0';
            background.style.transform = `translateY(${10 - (scrollPercent * 0.2)}%)`;
        }

        // Text animations - adjusted for 2 sections
        textWrappers.forEach((wrapper, index) => {
            const startPercent = index * 50;
            const endPercent = startPercent + 40;
            
            if (index === 0) { // Untuk section pertama
                if (scrollPercent > endPercent) {
                    wrapper.classList.remove('active');
                    wrapper.style.opacity = '0';
                    wrapper.style.transform = 'translateY(-5%)';
                } else {
                    wrapper.classList.add('active');
                }
            } else { // Untuk section kedua
                if (scrollPercent >= startPercent && scrollPercent <= endPercent) {
                    wrapper.style.opacity = '1';
                    wrapper.style.transform = 'translateY(0)';
                } else if (scrollPercent < startPercent) {
                    wrapper.style.opacity = '0';
                    wrapper.style.transform = 'translateY(5%)';
                } else {
                    wrapper.style.opacity = '0';
                    wrapper.style.transform = 'translateY(-5%)';
                }
            }
        });
    }

    window.addEventListener('scroll', updateScroll);
    updateScroll(); // Initial call
});
