document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const scrollProgress = document.querySelector('.scroll-progress');
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    
    // Preloader
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        setTimeout(() => {
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 800);
            }
        }, 1000);
    });

    // Custom Cursor
    const cursor = document.createElement('div');
    const follower = document.createElement('div');
    cursor.className = 'custom-cursor';
    follower.className = 'cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

        // Lagging follower
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

        // Parallax blobs
        const blobs = document.querySelectorAll('.bg-blob');
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.02;
            const x = (mouseX - window.innerWidth / 2) * speed;
            const y = (mouseY - window.innerHeight / 2) * speed;
            blob.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Spotlight & 3D Tilt Effect
    document.querySelectorAll('.service-card, .machinery-item, .bento-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Spotlight
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // 3D Tilt (only for bento & machinery)
            if (!card.classList.contains('service-card')) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
        });
    });

    // Cursor Interactions
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .machinery-item, .info-item, .btn, .bento-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            follower.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            follower.classList.remove('cursor-hover');
        });
    });

    // Magnetic Elements
    document.querySelectorAll('.btn, .logo, .nav-links a, .social-icons a').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate3d(0, 0, 0)`;
        });
    });

    // Scroll Effects
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        // Scroll Progress
        if (scrollProgress) scrollProgress.style.width = scrolled + "%";

        // Header Scrolled State
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Parallax Effect
        parallaxBgs.forEach(bg => {
            const scrollSpeed = 0.4;
            const parent = bg.parentElement;
            const rect = parent.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Centered parallax logic
                const centerOffset = (window.innerHeight - rect.height) / 2;
                const distance = rect.top - centerOffset;
                const yOffset = -(distance * scrollSpeed);
                bg.style.transform = `translate3d(0, ${yOffset}px, 0)`;
            }
        });
    });

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Staggered Reveal Observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-container, .about-text, .about-image').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Mesajınız başarıyla iletildi. Uzmanlarımız en kısa sürede sizinle iletişime geçecektir.');
            contactForm.reset();
        });
    }

    // Theme Switcher Logic
    const themeDropdown = document.getElementById('theme-dropdown');
    const themeLabel = document.getElementById('current-theme-label');
    const dropdownOptions = document.querySelectorAll('.dropdown-option');
    
    function setTheme(theme, updateURL = true) {
        document.body.className = ''; // Reset
        if (theme !== 'default') {
            document.body.classList.add(theme);
        }
        localStorage.setItem('selected-theme', theme);
        
        // Update Custom Dropdown UI
        const activeOption = document.querySelector(`.dropdown-option[data-value="${theme}"]`);
        if (activeOption) {
            dropdownOptions.forEach(opt => opt.classList.remove('active'));
            activeOption.classList.add('active');
            themeLabel.textContent = activeOption.textContent;
        }
        
        // Update URL
        if (updateURL) {
            const url = new URL(window.location);
            if (theme === 'default') {
                url.searchParams.delete('tasarim');
            } else {
                const designNum = theme.replace('tasarim-', '');
                url.searchParams.set('tasarim', designNum);
            }
            window.history.pushState({}, '', url);
        }
        
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    if (themeDropdown) {
        const trigger = themeDropdown.querySelector('.dropdown-trigger');
        
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('open');
        });

        dropdownOptions.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                setTheme(value);
                themeDropdown.classList.remove('open');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            themeDropdown.classList.remove('open');
        });

        // Load theme from URL or LocalStorage
        const urlParams = new URLSearchParams(window.location.search);
        const designParam = urlParams.get('tasarim');
        const savedTheme = localStorage.getItem('selected-theme');

        if (designParam) {
            const themeValue = designParam === 'default' ? 'default' : `tasarim-${designParam}`;
            setTheme(themeValue, false);
        } else if (savedTheme) {
            setTheme(savedTheme, false);
        }
    }

    // 3D Machinery Modal Logic
    const machineryData = [
        {
            title: "Ekskavatör",
            desc: "Hafriyat ve kazı işlerinin vazgeçilmez gücü. 360 derece dönebilme ve yüksek kazı kapasitesi ile şantiyelerin kalbi.",
            model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
        },
        {
            title: "Beko Loder",
            desc: "Kanal kazıma ve yükleme operasyonlarında uzmanlık. Hem kazıcı hem de yükleyici özellikleri ile çok yönlü kullanım.",
            model: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb"
        },
        {
            title: "Dozer",
            desc: "Arazi tesviyesi ve ağır itme güçleri için profesyonel eğitim. En zorlu zemin şartlarında üstün performans.",
            model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb"
        },
        {
            title: "Greyder",
            desc: "Yol yapımı ve yüzey düzleme sanatında uzmanlaşın. Hassas bıçak kontrolü ile mükemmel yüzey kalitesi.",
            model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb"
        },
        {
            title: "Forklift",
            desc: "Depolama ve lojistik sektörünün aranan operatörü olun. Dar alanlarda yüksek manevra kabiliyeti.",
            model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/ToyCar/glTF-Binary/ToyCar.glb"
        },
        {
            title: "Manlift",
            desc: "Yüksekte güvenli çalışma ve manlift kullanımı. Personel yükseltme platformlarında emniyetli operasyon.",
            model: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/SheenChair/glTF-Binary/SheenChair.glb"
        }
    ];

    let currentMachineryIndex = 0;
    const modal = document.getElementById('machinery-modal');
    const viewer = document.getElementById('main-viewer');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');

    function updateModalContent(index) {
        const item = machineryData[index];
        if (!item) return;
        
        modalTitle.textContent = item.title;
        modalDesc.textContent = item.desc;
        viewer.src = item.model;
        
        // Show loading state if needed
        viewer.addEventListener('load', () => {
            console.log('Model loaded:', item.title);
        }, { once: true });
    }

    function openModal(index) {
        currentMachineryIndex = index;
        updateModalContent(index);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        viewer.src = ''; // Clear viewer
    }

    // Event Listeners for Machinery Items
    document.querySelectorAll('.machinery-item').forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            openModal(index);
        });
    });

    // Modal Controls
    if (modal) {
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        
        modal.querySelector('.prev-btn').addEventListener('click', () => {
            currentMachineryIndex = (currentMachineryIndex - 1 + machineryData.length) % machineryData.length;
            updateModalContent(currentMachineryIndex);
        });

        modal.querySelector('.next-btn').addEventListener('click', () => {
            currentMachineryIndex = (currentMachineryIndex + 1) % machineryData.length;
            updateModalContent(currentMachineryIndex);
        });

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') modal.querySelector('.prev-btn').click();
            if (e.key === 'ArrowRight') modal.querySelector('.next-btn').click();
        });
    }
});
