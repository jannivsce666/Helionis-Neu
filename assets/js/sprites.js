/**
 * Helionis Mystical Sprites Helper
 * Replaces emojis with custom SVG sprites
 */

class MysticalSprites {
  constructor() {
    this.spriteMap = {
      '✨': 'sparkle',
      '⭐': 'star', 
      '🌟': 'starburst',
      '🔮': 'crystal-ball',
      '🌙': 'moon',
      '💫': 'magic',
      '❤️': 'heart-filled',
      '🤍': 'heart-outline',
      '🌍': 'world',
      '🔥': 'fire',
      '↩️': 'return-arrow',
      '🗑️': 'trash',
      '🧿': 'mystic-eye',
      // Added UI/commerce icons
      '🚚': 'truck',
      '🔒': 'lock',
      '🏦': 'bank',
      '🛒': 'cart',
      '👤': 'user',
      '📦': 'package',
      '💳': 'credit-card',
      '✏️': 'pencil',
      '⬆️': 'arrow-up',
      '⚙️': 'gear',
      '🔐': 'lock',
      '🎁': 'gift',
      '📤': 'share'
      ,
      // Additional UI/status icons used across the site
      '📊': 'chart',
      '📍': 'pin',
      '📄': 'document',
      '✅': 'check',
      '🔄': 'refresh',
      '📖': 'book',
      '❌': 'cross',
      '🚪': 'door-exit',
      '♓': 'pisces',
      '💎': 'diamond'
    };
    
    this.loadSprites();
  }

  /**
   * Load the SVG sprite sheet into the DOM
   */
  async loadSprites() {
    try {
      // Prefer relative path for Live Server/subfolder hosting; fall back to absolute
      let response = await fetch('assets/sprites/mystical-sprites.svg');
      if (!response.ok) {
        response = await fetch('/assets/sprites/mystical-sprites.svg');
      }
      const svgText = await response.text();
      
      // Insert sprites at the beginning of body
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = svgText;
      document.body.insertBefore(tempDiv.firstElementChild, document.body.firstChild);

      // Initial sweep: replace emojis in the whole document
      this.replaceEmojisInElement(document.body);

      // Observe DOM mutations to replace emojis added later (dynamic content)
      const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
          if (m.type === 'childList') {
            m.addedNodes.forEach(node => {
              if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
                this.replaceEmojisInElement(node.parentNode);
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                this.replaceEmojisInElement(node);
              }
            });
          } else if (m.type === 'characterData' && m.target && m.target.parentNode) {
            this.replaceEmojisInElement(m.target.parentNode);
          }
        }
      });
      observer.observe(document.body, { subtree: true, childList: true, characterData: true });

      console.log('Mystical sprites loaded');
    } catch (error) {
      console.warn('Could not load mystical sprites:', error);
    }
  }

  /**
   * Create a sprite element
   */
  createSprite(spriteId, options = {}) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    
    svg.classList.add('mystical-sprite');
    
    // Add size class
    if (options.size) {
      svg.classList.add(options.size);
    }
    
    // Add custom classes
    if (options.className) {
      svg.classList.add(...options.className.split(' '));
    }
    
    // Add interactive behavior
    if (options.interactive) {
      svg.classList.add('interactive');
    }
    
    // Add animation
    if (options.animated) {
      svg.classList.add('animated');
    }
    
  // Set both modern and legacy href attributes for broad browser support
  use.setAttribute('href', `#${spriteId}`);
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${spriteId}`);
    svg.appendChild(use);
    
    return svg;
  }

  /**
   * Replace emoji with sprite
   */
  replaceEmoji(emoji, options = {}) {
    const spriteId = this.spriteMap[emoji];
    if (spriteId) {
      return this.createSprite(spriteId, options);
    }
    return document.createTextNode(emoji); // Fallback to original emoji
  }

  /**
   * Replace all emojis in a text node
   */
  replaceEmojisInText(text, options = {}) {
    const fragment = document.createDocumentFragment();
    
    // Split text by emojis and create appropriate nodes
  const parts = text.split(/(✨|⭐|🌟|🔮|🌙|💫|❤️|🤍|🌍|🔥|↩️|🗑️|🧿|🚚|🔒|🏦|🛒|👤|📦|💳|✏️|⬆️|⚙️|🔐|🎁|📤|📊|📍|📄|✅|🔄|📖|❌|🚪|♓|💎)/);
    
    parts.forEach(part => {
      if (this.spriteMap[part]) {
        fragment.appendChild(this.replaceEmoji(part, options));
      } else if (part) {
        fragment.appendChild(document.createTextNode(part));
      }
    });
    
    return fragment;
  }

  /**
   * Replace emojis in an element
   */
  replaceEmojisInElement(element, options = {}) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      const text = textNode.textContent;
      if (text && /[✨⭐🌟🔮🌙💫❤️🤍🌍🔥↩️🗑️🧿🚚🔒🏦🛒👤📦💳✏️⬆️⚙️🔐🎁📤📊📍📄✅🔄📖❌🚪♓💎]/.test(text)) {
        const fragment = this.replaceEmojisInText(text, options);
        textNode.parentNode.replaceChild(fragment, textNode);
      }
    });
  }

  /**
   * Star rating helper
   */
  createStarRating(rating, maxStars = 5) {
    const container = document.createElement('span');
    container.className = 'star-rating';
    
    for (let i = 0; i < maxStars; i++) {
      const star = this.createSprite('star', {
        className: 'star-rating',
        size: 'small'
      });
      
      if (i >= rating) {
        star.style.opacity = '0.3';
      }
      
      container.appendChild(star);
    }
    
    return container;
  }

  /**
   * Heart toggle for wishlist
   */
  createHeartToggle(isActive = false, onClick = null) {
    const heart = this.createSprite(isActive ? 'heart-filled' : 'heart-outline', {
      className: 'heart-wishlist interactive',
      interactive: true
    });
    
    if (onClick) {
      heart.addEventListener('click', onClick);
    }
    
    return heart;
  }
}

// Initialize sprites when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.mysticalSprites = new MysticalSprites();
  });
} else {
  window.mysticalSprites = new MysticalSprites();
}

// Export for use in other scripts
window.MysticalSprites = MysticalSprites;

// SVG Sprites for Helionis
document.addEventListener('DOMContentLoaded', function() {
    // Create SVG sprite container
    const svgSprites = `
        <svg style="display: none;" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <symbol id="cart" viewBox="0 0 24 24">
                    <path d="M7 4H2v2h3.055l1.641 7.388A2 2 0 0 0 8.618 15H19a1 1 0 0 0 .958-.713L22 7H8.618a2 2 0 0 0-1.922-1.287L5.055 2H2V0h3.055a2 2 0 0 1 1.922 1.287L7 4zm0 13a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                </symbol>
                
                <symbol id="user" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </symbol>
                
                <symbol id="user-check" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    <circle cx="18" cy="6" r="3" fill="currentColor"/>
                    <path d="m16.5 7.5 1 1 2-2" stroke="white" stroke-width="1.5" fill="none"/>
                </symbol>
                
                <symbol id="star" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </symbol>
                
                <symbol id="sparkle" viewBox="0 0 24 24">
                    <path d="M12 0l1.5 4.5L18 6l-4.5 1.5L12 12l-1.5-4.5L6 6l4.5-1.5L12 0zm7 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zm-12 7l.5 1.5L9 21l-1.5.5L7 23l-.5-1.5L5 21l1.5-.5L7 19z"/>
                </symbol>
                
                <symbol id="heart" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </symbol>
                
                <symbol id="edit" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </symbol>
                
                <symbol id="download" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </symbol>
            </defs>
        </svg>
    `;
    
    // Insert sprites at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', svgSprites);
});