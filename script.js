const marqueeManager = {
    animationId: null,
    wrapper: null,
    originalItems: [],
    clones: [],
    isMobile: false,
    speed: 0.5,
    
    init() {
        this.wrapper = document.querySelector('.works-with__wrapper');
        if (!this.wrapper) return;
        
        this.originalItems = Array.from(document.querySelectorAll('.works-with__item'));
        if (this.originalItems.length === 0) return;
        
        this.checkViewport();
    },
    
    checkViewport() {
        const nowIsMobile = window.innerWidth <= 900;
        
        if (nowIsMobile === this.isMobile) return;
        
        this.isMobile = nowIsMobile;
        
        if (this.isMobile) {
            this.setupMobile();
        } else {
            this.cleanupDesktop();
        }
    },
    
    setupMobile() {
        this.clones = this.originalItems.map(item => {
            const clone = item.cloneNode(true);
            this.wrapper.appendChild(clone);
            return clone;
        });
        
        this.startAnimation();
    },
    
    cleanupDesktop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        this.clones.forEach(clone => {
            if (clone.parentNode === this.wrapper) {
                this.wrapper.removeChild(clone);
            }
        });
        this.clones = [];
        
        this.wrapper.style.transform = 'translateX(0)';
    },
    
    startAnimation() {
        if (!this.isMobile || this.animationId) return;
        
        let position = 0;
        const animate = () => {
            if (!this.isMobile) return;
            
            const firstItem = this.originalItems[0];
            if (!firstItem) return;
            
            const itemWidth = firstItem.offsetWidth + 24; 
            const totalWidth = itemWidth * this.originalItems.length;
            
            position -= this.speed;
            
            if (position <= -totalWidth) {
                position = 0;
            }
            
            this.wrapper.style.transform = `translateX(${position}px)`;
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
};

document.addEventListener('DOMContentLoaded', () => marqueeManager.init());

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => marqueeManager.checkViewport(), 100);
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (marqueeManager.animationId) {
            cancelAnimationFrame(marqueeManager.animationId);
            marqueeManager.animationId = null;
        }
    } else if (marqueeManager.isMobile) {
        marqueeManager.startAnimation();
    }
});
// mask phone
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';

    if (value.length > 0) {
        formattedValue = '+7 ';
        if (value.length > 1) {
            formattedValue += '(' + value.substring(1, 4);
        }
        if (value.length > 4) {
            formattedValue += ')' + value.substring(4, 7);
        }
        if (value.length > 7) {
            formattedValue += '-' + value.substring(7, 9);
        }
        if (value.length > 9) {
            formattedValue += '-' + value.substring(9, 11);
        }

        // Проверка на полноту номера
        if (value.length === 11) {
            phoneInput.classList.remove('error-outline');
            phoneError.style.display = 'none';
        } 
    }

    e.target.value = formattedValue;
});

phoneInput.addEventListener('keydown', function (e) {
    if (e.target.value.replace(/\D/g, '').length >= 11 && e.key !== 'Backspace') {
        e.preventDefault();
    }
});


document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    const phoneValue = phoneInput.value.replace(/\D/g, '');
    if (phoneValue.length === 11) {
        alert('Форма отправлена! (имитация)');
        phoneInput.classList.remove('error-outline');
        phoneError.style.display = 'none';
    } else {
        phoneInput.classList.add('error-outline');
        phoneError.style.display = 'inline';
    }
});
