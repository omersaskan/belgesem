// Global Initializations
document.body.classList.add('light-mode');
document.body.classList.add('tasarim-1');

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
    document.querySelectorAll('.service-card, .machinery-item, .bento-item, .team-card, .reference-item').forEach(card => {
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

    // Magnetic Elements removed for better corporate feel

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

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Create Nav Overlay dynamically
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) navContainer.appendChild(navOverlay);

    if (mobileMenuToggle && navLinks) {
        const closeMenu = () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        };

        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            navOverlay.classList.toggle('active');
            if (!isActive) closeMenu();
        });

        // Robust listener for all menu-related clicks
        document.addEventListener('click', (e) => {
            const isNavActive = navLinks.classList.contains('active');
            if (!isNavActive) return;

            const isClickInsideNav = navLinks.contains(e.target);
            const isClickInsideToggle = mobileMenuToggle.contains(e.target);

            if (!isClickInsideNav && !isClickInsideToggle) {
                // Clicked outside the entire menu card (on overlay)
                closeMenu();
            } else if (isClickInsideNav) {
                // Clicked inside the menu card
                const dropdownTrigger = e.target.closest('.nav-item > a');
                const isInsideOpenDropdown = e.target.closest('.nav-item.active .dropdown-menu');
                
                if (dropdownTrigger) {
                    // It's a dropdown toggle (accordion)
                    if (window.innerWidth <= 1024) {
                        e.preventDefault();
                        const parent = dropdownTrigger.parentElement;
                        
                        // Close other accordions
                        document.querySelectorAll('.nav-item').forEach(other => {
                            if (other !== parent) other.classList.remove('active');
                        });
                        
                        parent.classList.toggle('active');
                    }
                } else if (!isInsideOpenDropdown) {
                    // Clicked on a regular link or empty space inside the menu card
                    // Close any open accordions
                    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
                    
                    // If it was a regular link (not a dropdown trigger), close the whole menu
                    if (e.target.closest('a')) {
                        closeMenu();
                    }
                }
            }
        });
    }

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

    // Cross-page Anchor Fix: Check hash on load and scroll with offset
    if (window.location.hash) {
        // Small delay to let browser finish its default jump before we correct it
        setTimeout(() => {
            try {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } catch (e) {
                // Ignore invalid hash queries
            }
        }, 150); 
    }
    
    // Hero Scroll Indicator Click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const statsSection = document.getElementById('stats');
            if (statsSection) {
                statsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

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

    // WhatsApp Chatbot Logic
    const chatbotWidget = document.getElementById('chatbot-widget');
    const wpTrigger = document.getElementById('wp-trigger');
    const closeChat = document.getElementById('close-chatbot');

    // Special Trigger for Course Program Items
    // Visual selection logic for program items moved to button-specific handlers or removed for cleaner UX
    // (Old listener at lines 244-267 removed to prevent conflict with new buttons)

    // Enhanced Trigger for Navbar and Footer Buttons
    document.querySelectorAll('.basvuru-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (chatbotWidget) {
                // Check if there's a selected course in the same card
                const card = trigger.closest('.course-program-card');
                let courseName = trigger.getAttribute('data-course');
                
                if (card) {
                    const selected = card.querySelector('.program-item.selected');
                    if (selected) {
                        courseName = selected.querySelector('p').textContent;
                    }
                }
                
                chatbotWidget.classList.add('active');
                chatbot.init(courseName);
            }
        });
    });


    const chatbot = {
        messages: null,
        input: null,
        sendBtn: null,
        state: 'greeting',
        initialized: false,
        userData: {
            name: '',
            course: '',
            message: ''
        },
        
        init(preselectedCourse = null) {
            this.messages = document.getElementById('chat-messages');
            this.input = document.getElementById('chat-input');
            this.sendBtn = document.getElementById('send-chat');

            if (!this.messages || !this.input || !this.sendBtn) return;
            
            // Always clear messages on init to prevent accumulation
            this.messages.innerHTML = ''; 
            
            if (preselectedCourse) {
                this.userData.course = preselectedCourse;
                this.state = 'ask_name_with_course';
                this.addBotMessage(`Merhaba! <b>${preselectedCourse}</b> eğitimi ile ilgileniyorsunuz, harika bir seçim! Size nasıl hitap etmemi istersiniz? (Adınız ve Soyadınız)`);
            } else {
                this.state = 'greeting';
                this.addBotMessage("Merhaba! BELGESEM'e hoş geldiniz. Ben dijital asistanınız. Size nasıl hitap etmemi istersiniz? (Adınız ve Soyadınız)");
            }

            // Only register event listeners once
            if (this.initialized) return;
            this.initialized = true;
            
            this.sendBtn.addEventListener('click', () => this.handleUserInput());
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleUserInput();
            });
        },
        
        addBotMessage(text) {
            const div = document.createElement('div');
            div.className = 'chat-bubble bot-bubble';
            div.innerHTML = text;
            this.messages.appendChild(div);
            this.scrollToBottom();
        },
        
        addUserMessage(text) {
            const div = document.createElement('div');
            div.className = 'chat-bubble user-bubble';
            div.textContent = text;
            this.messages.appendChild(div);
            this.scrollToBottom();
        },
        
        scrollToBottom() {
            this.messages.scrollTop = this.messages.scrollHeight;
        },
        
        handleUserInput() {
            const text = this.input.value.trim();
            if (!text) return;
            
            this.addUserMessage(text);
            this.input.value = '';
            
            setTimeout(() => {
                this.processState(text);
            }, 600);
        },
        
        processState(text) {
            switch(this.state) {
                case 'greeting':
                    this.userData.name = text;
                    this.state = 'ask_course';
                    this.addBotMessage(`Memnun oldum ${text}! Hangi eğitimimizle ilgileniyorsunuz?`);
                    this.showOptions(['İş Makinesi Operatörlüğü', 'Tarım Makinası Operatörlüğü', 'Diğer Eğitimler']);
                    break;
                case 'ask_name_with_course':
                    this.userData.name = text;
                    this.state = 'ask_message';
                    this.addBotMessage(`Memnun oldum ${text}! Seçtiğiniz <b>${this.userData.course}</b> eğitimi için talebinizi alıyorum. Son olarak eklemek istediğiniz bir not var mı?`);
                    break;
                case 'ask_course':
                    this.userData.course = text;
                    this.state = 'ask_message';
                    this.addBotMessage("Harika seçim. Son olarak, eklemek istediğiniz bir not veya sorunuz var mı?");
                    break;
                case 'ask_message':
                    this.userData.message = text;
                    this.state = 'done';
                    this.addBotMessage("Bilgilerinizi aldım. Sizi WhatsApp başvuru hattımıza yönlendiriyorum...");
                    setTimeout(() => this.redirectToWhatsApp(), 1500);
                    break;
            }
        },
        
        showOptions(options) {
            const div = document.createElement('div');
            div.className = 'chat-options';
            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'chat-option-btn';
                btn.textContent = opt;
                btn.onclick = () => {
                    this.input.value = opt;
                    this.handleUserInput();
                    div.remove();
                };
                div.appendChild(btn);
            });
            this.messages.appendChild(div);
            this.scrollToBottom();
        },
        
        redirectToWhatsApp() {
            const wpNumber = "905342699666";
            const message = encodeURIComponent(`Merhaba BELGESEM, yeni başvurum var:\n\n*Ad Soyad:* ${this.userData.name}\n*Eğitim:* ${this.userData.course}\n*Not:* ${this.userData.message}`);
            const url = `https://api.whatsapp.com/send?phone=${wpNumber}&text=${message}`;
            
            // Use location.href instead of window.open to bypass mobile popup blockers
            window.location.href = url;
        }
    };

    if (wpTrigger) {
        wpTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            chatbotWidget.classList.toggle('active');
            if (chatbotWidget.classList.contains('active')) {
                chatbot.init();
            }
        });
    }

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatbotWidget.classList.remove('active');
        });
    }

    // Technical Training Data
    const commonLegalBasis = [
        "5580 Sayılı Özel Öğretim Kurumları Kanunu",
        "Özel Öğretim Kurumları Yönetmeliği",
        "14.08.2015 tarihli ve 72 sayılı Kurul Kararıyla kabul edilen Özel Kurslar Çerçeve Programı",
        "MEB Özel Öğretim Kurumları Genel Müdürlüğü Yönergesi",
        "Karayolları Trafik Kanunu ve Yönetmeliği"
    ];

    const machineryDetails = {
        "BEKO LODER": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/9.jpeg",
            imageMobile: "assets/yeni_gorseller/9.jpeg",
            intro: "Beko Loder, ya da diğer bilinen adıyla kazıcı-yükleyici, traktör gövdesinin önünde kova ve arkasında kazıcı ile birleştirilmesi ile ortaya çıkmış olan bir iş makinesidir.",
            objectives: [
                "Kazıcı ve yükleyici kısımların hidrolik sistem kontrollerini kavrama",
                "Malzeme yükleme, taşıma ve toprak kazma tekniklerini geliştirme",
                "Emniyet kuralları ve iş güvenliği standartlarını uygulama",
                "Dar alanlarda ve küçük ölçekli şantiyelerde güvenli sürüş"
            ],
            workAreas: "Dar alanlı ve küçük ölçekteki yapı yerleri, Yol yapım faaliyetleri, Kazı işleri, İnşaat ve yapı işlemleri, Kent ve peyzaj tasarımları."
        },
        "EKSKAVATÖR": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/4.jpeg",
            imageMobile: "assets/yeni_gorseller/4.jpeg",
            intro: "Alt kısmı paletli, lastik tekerlekli veya kamyon şasili olan bu esnek iş makinesi, kendi bulunduğu düzeyin altında veya üzerinde kazı yapabilme kabiliyetine sahiptir.",
            objectives: [
                "Tahrik motoru ve kumanda tertibatının teknik işleyişini anlama",
                "Farklı kepçe türleri (düz, ters, çeneli) ile kazı teknikleri",
                "Yıkım, kazı ve arazi düzenleme operasyonlarında güvenlik",
                "Aşınan parçaların kontrolü ve periyodik bakım bilgisi"
            ],
            workAreas: "Yıkım, kazı ve arazi düzenleme işleri, büyük ölçekli altyapı ve inşaat projeleri."
        },
        "LODER": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/8.jpeg",
            imageMobile: "assets/yeni_gorseller/8.jpeg",
            intro: "Loder (Yükleyici), önde yüklemeyi sağlayan kepçe kısmından oluşan ve ağır malzemelerin taşınması, yüklenmesi ya da boşaltılması işlemlerinde kullanılan güçlü bir makinedir.",
            objectives: [
                "Kepçe ve hidrolik sistemlerin etkin ve güvenli kullanımı",
                "Ağır malzemelerin dengeli yüklenmesi ve transferi",
                "İnşaat, madencilik ve tarım alanlarındaki operasyonel süreçler",
                "Verimli yakıt kullanımı ve operasyonel hız teknikleri"
            ],
            workAreas: "İnşaat şantiyeleri (bina, yol, köprü), maden ocakları, tarım arazileri, belediye ve kamu kurumları altyapı çalışmaları."
        },
        "FORKLİFT": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07098_1.jpg",
            imageMobile: "assets/mobile/DSC07098.jpg",
            intro: "Forklift, ağır yükleri çatalları aracılığıyla kaldırmak ve özellikle paletlerin üzerindeki ağırlıkları taşımak, kaldırmak ve istif etmek için kullanılan vazgeçilmez bir araçtır.",
            objectives: [
                "Yüklerin dengeli kaldırılması ve raflara güvenli istiflenmesi",
                "Lojistik ve depo içi dar alanlarda manevra kabiliyeti",
                "Çatal kontrolü ve yük merkezi hesaplama prensipleri",
                "İş makinesi operatörlük belgesi standartlarına uygun kullanım"
            ],
            workAreas: "Otomotiv sektörü, gıda sektörü, lojistik depoları, antrepolar ve çeşitli üretim tesisleri."
        },
        "GREYDER": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/10.jpeg",
            imageMobile: "assets/yeni_gorseller/10.jpeg",
            intro: "Greyderler; tesviye işleri, yol yapımı, hendek kazma, karıştırma, yayma ve karla mücadele gibi çok amaçlı görevlerde kullanılan hassas makinelerdir.",
            objectives: [
                "Tesviye, bombelik verme ve yüzey düzleme teknikleri",
                "Malzeme yayma ve yana yığma operasyonları",
                "Hafif kazıma ve hendek açma süreçlerinde bıçak kontrolü",
                "Yol yapım ve bakım projelerinde operasyonel yetkinlik"
            ],
            workAreas: "Yol yapımı, yüzey düzleme çalışmaları, tarım arazisi düzenleme, karla mücadele faaliyetleri."
        },
        "DOZER (PALETLİ)": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/15.jpeg",
            imageMobile: "assets/yeni_gorseller/15.jpeg",
            intro: "İnşaat sahalarında toprak ve moloz taşımak için kullanılan, büyük bir bıçak ve güçlü paletlerle donatılmış, yüksek itme gücüne sahip iş makinesidir.",
            objectives: [
                "Bıçak kontrolü ile toprak kazma ve taşıma teknikleri",
                "Zorlu arazi koşullarında paletli şasi hakimiyeti",
                "İnşaat, maden ve tarım alanlarındaki zemin hazırlık süreçleri",
                "Güvenli operasyon ve makine sınırlarının etkin kullanımı"
            ],
            workAreas: "İnşaat şantiyeleri (bina, yol, köprü), maden sahaları, belediye yol bakım çalışmaları, tarım arazisi hazırlığı."
        },
        "SİLİNDİR": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/2.jpeg",
            imageMobile: "assets/yeni_gorseller/2.jpeg",
            intro: "Asfalt silindiri; yola dökülen asfalt, çakıl gibi malzemelerin eşit ve düz bir şekilde yayılmasını sağlayan, zemini sıkıştırarak presleyen kritik bir araçtır.",
            objectives: [
                "Zemin sıkıştırma ve presleme tekniklerini uygulama",
                "Engebeli arazileri dayanıklı ve düz hale getirme",
                "Büyük yapı inşaatları öncesi zemin güçlendirme yöntemleri",
                "Yol, havaalanı ve stadyum yapımındaki operasyonel adımlar"
            ],
            workAreas: "Karayolu yapımı ve onarımı, inşaat alanları, su kanalı açımı, havaalanı ve otogar yapımı, stadyum projeleri."
        },
        "MOBİL VİNÇ": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07050.jpg",
            imageMobile: "assets/mobile/DSC07049.jpg",
            intro: "Tekerlekli şasi üzerine monte edilmiş, çeşitli yükleri kaldırıp taşıyabilen hidrolik veya elektrikli sistemlerle donatılmış çok yönlü bir kaldırma aracıdır.",
            objectives: [
                "Ağır makine, konteyner ve yapı elemanlarının güvenli kaldırılması",
                "Montaj ve demontaj süreçlerinde hassas vinç kontrolü",
                "Dış cephe çalışmaları ve yüksek katlı bina operasyonları",
                "Enerji ve sanayi sektöründeki teknik kaldırma prosedürleri"
            ],
            workAreas: "Fabrika taşıma, ağır makine nakliyesi, çelik konstrüksiyon montajı, bina dış cephe işleri, enerji sektörü montaj çalışmaları."
        },
        "İSTİF MAKİNESİ": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/16.jpeg",
            imageMobile: "assets/yeni_gorseller/16.jpeg",
            intro: "Genellikle elektrikli modelleri bulunan, dar alanlarda yükleri belirli bir yüksekliğe (6 metreye kadar) kaldırarak depolama düzeni sağlayan araçlardır.",
            objectives: [
                "Yüklerin yüksek raflara güvenli yerleştirilmesi ve düzenlenmesi",
                "Dar alanlarda akülü istif makinesi manevra teknikleri",
                "Depo içi düzenleme ve lojistik verimlilik standartları",
                "Güvenli yük kaldırma ve taşıma kapasitesi kontrolü"
            ],
            workAreas: "Depolar, fabrikalar, limanlar ve lojistik merkezleri."
        },
        "ELEKTRİKLİ TRANSPALET": {
            category: "İş Makinesi",
            duration: "18 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/3.jpeg",
            imageMobile: "assets/yeni_gorseller/3.jpeg",
            intro: "Paletli yüklerin kısa mesafelerde taşınması ve depolama alanları arasında kolayca yönlendirilmesi için tasarlanmış, zemin seviyesinde çalışan pratik araçlardır.",
            objectives: [
                "Elektrikli transpalet ile güvenli yük transferi",
                "Depolama alanları arası lojistik akışın yönetimi",
                "Palet yerleştirme ve kısa mesafe taşıma teknikleri",
                "Makine periyodik bakımı ve şarj yönetimi"
            ],
            workAreas: "Depolar, fabrikalar, atölyeler ve gıda sektörü işletmeleri."
        },
        "KÖPRÜLÜ VİNÇ": {
            category: "İş Makinesi",
            duration: "48 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/5.jpeg",
            imageMobile: "assets/yeni_gorseller/5.jpeg",
            intro: "İki paralel ray üzerinde hareket eden köprü yapısıyla geniş alanlarda ağır yük taşıma kabiliyeti sunan güçlü ve dayanıklı sistemlerdir.",
            objectives: [
                "Ray üstü hareketli sistemlerin kontrol mekanizmaları",
                "Ağır metal ve endüstriyel yüklerin güvenli transferi",
                "Döküm haneler ve tersane gibi zorlu ortamlarda çalışma disiplini",
                "Sapanlama ve işaretçi koordinasyonu ile vinç kullanımı"
            ],
            workAreas: "Demir-çelik tesisleri, döküm haneler, tersaneler, madenler, limanlar ve gıda üretim tesisleri."
        },
        "PERSONEL VE YÜK YÜKSELTİCİ (MANLİFT)": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/14.jpeg",
            imageMobile: "assets/yeni_gorseller/14.jpeg",
            intro: "İşçilerin ve ekipmanların güvenli bir şekilde yüksekte çalışmasını sağlayan, verimli ve emniyetli bir çalışma ortamı sunan platformlardır.",
            objectives: [
                "Yükseklikte çalışma güvenliği ve platform kontrolü",
                "Bakım, onarım ve montaj işlerinde manlift kullanımı",
                "Farklı zemin koşullarında stabilizasyon teknikleri",
                "Keşif, taahhüt ve süsleme çalışmalarındaki operasyonlar"
            ],
            workAreas: "AVM'ler, fabrikalar, tersaneler, inşaat alanları, tesis bakımı ve dış cephe reklam çalışmaları."
        },
        "ÇEKME ARACI İŞ MAKİNESİ": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/13.jpeg",
            imageMobile: "assets/yeni_gorseller/13.jpeg",
            intro: "Trafiğe kapalı alanlarda bagaj, kargo ve yüklerin güvenli taşınması için kullanılan, genellikle elektrikle çalışan çekme araçlarıdır.",
            objectives: [
                "Römork bağlantısı ve güvenli yük sevkiyatı",
                "Havalimanı ve fabrika içi trafik kurallarına uyum",
                "Elektrikli çekme araçlarının teknik kontrolü ve kullanımı",
                "Yüklerin sarsıntısız ve emniyetli transferi"
            ],
            workAreas: "Fabrikalar, büyük depolar ve havalimanları."
        },
        "ZEMİN, YOL SÜPÜRME VE TEMİZLEME MAKİNESİ": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/21.jpeg",
            imageMobile: "assets/yeni_gorseller/21.jpeg",
            intro: "Sert zeminlerin fırça, ped ve vakum sistemleri ile hızlı ve etkili bir şekilde temizlenmesini sağlayan profesyonel temizlik makineleridir.",
            objectives: [
                "Fırça ve vakum sistemlerinin etkin ayarlanması",
                "Temizlik kimyasallarının doğru kullanımı ve zemin analizi",
                "Geniş alanlarda zaman ve iş gücü tasarrufu teknikleri",
                "Sürücülü otomatlar ve yüksek basınçlı sistemlerin yönetimi"
            ],
            workAreas: "Fabrikalar, AVM'ler, oteller, okullar, hastaneler ve üretim tesisleri."
        },
        "BUGGY (GOLF ARABASI)": {
            category: "İş Makinesi",
            duration: "44 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/11.jpeg",
            imageMobile: "assets/yeni_gorseller/11.jpeg",
            intro: "Elektrikli veya içten yanmalı motorlu, yol dışı alanlarda personel ve bagaj/yük taşıma amacıyla kullanılan pratik araçlardır.",
            objectives: [
                "Güvenli yolcu ve hafif yük taşıma teknikleri",
                "Kampüs ve tatil köyü içi güvenli sürüş disiplini",
                "Elektrikli motor sistemleri ve şarj prosedürleri",
                "Dar yollarda ve kalabalık alanlarda manevra yetkinliği"
            ],
            workAreas: "Fabrikalar, kampüsler, tatil köyleri, hastaneler, havalimanları ve oteller."
        },
        "PAMUK TOPLAMA MAKİNESİ": {
            category: "Tarım Makinesi",
            duration: "78 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/22.jpeg",
            imageMobile: "assets/yeni_gorseller/22.jpeg",
            intro: "Pamuk bitkisinin tarladan otomasyonla toplanmasını sağlayan, traktörle çekilen veya kendi yürür çeşitleri bulunan ileri teknoloji bir tarım makinesidir.",
            objectives: [
                "Pamuk hasat sistemlerinin teknik kontrolü ve ayarları",
                "Hasat sırasında ürün kaybını minimize etme teknikleri",
                "Kendi yürür makinelerde arazi hakimiyeti ve güvenlik",
                "Sezonluk bakım ve depolama öncesi hazırlık süreçleri"
            ],
            workAreas: "Özel tarım işletmeleri, büyük ölçekli pamuk çiftlikleri ve hasat hizmeti veren firmalar."
        },
        "SİLAJ MAKİNESİ": {
            category: "Tarım Makinesi",
            duration: "78 Saat Eğitim",
            imageWeb: "https://images.unsplash.com/photo-1541625602330-2277a4c4b282?auto=format&fit=crop&q=80&w=1000",
            imageMobile: "https://images.unsplash.com/photo-1541625602330-2277a4c4b282?auto=format&fit=crop&q=80&w=1000",
            intro: "Yeşil yem bitkilerini biçip parçalayarak havasız ortamda saklanabilir (silaj) hale getiren, besin değerini koruyan profesyonel tarım makinesidir.",
            objectives: [
                "Biçme ve parçalama mekanizmalarının hassas ayarı",
                "Yemlerin besin değerini koruyacak işleme teknikleri",
                "Traktör kuyruk mili veya kendinden motorlu sistemlerin kullanımı",
                "Hatasız doldurma ve nakliye koordinasyonu"
            ],
            workAreas: "Tarla hasat alanları, çiftlik içi silo yakınları ve hayvancılık işletmeleri."
        },
        "BİÇERDÖVER": {
            category: "Tarım Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/20.jpeg",
            imageMobile: "assets/yeni_gorseller/20.jpeg",
            intro: "Hasat, harman ve savurma işlemlerini tek geçişte yaparak buğday, arpa, mısır gibi ürünleri ayrıştıran yüksek kapasiteli motorlu tarım makinesidir.",
            objectives: [
                "Ürüne göre dövme ve eleme sistemi ayarlamaları",
                "GPS destekli hasat ve verim izleme sistemleri",
                "Maksimum kapasite ile minimum ürün kaybı stratejileri",
                "Yangın güvenliği ve hasat sırasında acil durum yönetimi"
            ],
            workAreas: "Geniş tarım arazileri, özel hasat işletmeleri ve büyük ölçekli çiftlikler."
        },
        "ÇIRÇIR MAKİNESİ": {
            category: "Tarım Makinesi",
            duration: "78 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/12.jpeg",
            imageMobile: "assets/yeni_gorseller/12.jpeg",
            intro: "Tarladan toplanan kütlü pamuğu çiğitlerinden ve yabancı maddelerden ayırarak elyafı temizleyen kritik bir endüstriyel cihazdır.",
            objectives: [
                "Liflerin tohumdan ayrılması sürecindeki teknik kontrol",
                "Elyaf temizleme ve kalite standartlarının korunması",
                "Endüstriyel çırçır sistemlerinin güvenli işletimi",
                "Hammadde girişinden temizlenmiş pamuk çıkışına kadar proses yönetimi"
            ],
            workAreas: "Çırçır fabrikaları, pamuk işleme tesisleri ve tekstil ön hazırlık birimleri."
        },
        "SONDAJ": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/25.jpeg", /* Uses mobile path because file only exists there */
            imageMobile: "assets/yeni_gorseller/25.jpeg",
            intro: "Sondaj makinesi, yer altında su, maden veya zemin etüdü için delik açmada kullanılan güçlü bir iş makinesidir.",
            objectives: [
                "Sondaj kulesi ve matkap sistemlerinin kurulumu",
                "Farklı zemin yapılarında delme teknikleri",
                "Sondaj çamuru ve kuyu güvenliği yönetimi",
                "Hidrolik ve mekanik sistemlerin periyodik kontrolü"
            ],
            workAreas: "Su kuyusu açma, maden arama, zemin etüdü ve jeotermal projeler."
        },
        "İTFAİYE ARACI": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/7.jpeg",
            imageMobile: "assets/yeni_gorseller/7.jpeg",
            intro: "İtfaiye araçları, yangınla mücadele ve kurtarma operasyonları için özel donanımlara sahip acil müdahale araçlarıdır.",
            objectives: [
                "Pompa ve su ikmal sistemlerinin kullanımı",
                "Merdiven ve kurtarma ekipmanlarının operasyonu",
                "Acil durum sürüş teknikleri ve saha güvenliği",
                "Araç üstü ekipmanların teknik bakımı"
            ],
            workAreas: "Belediye itfaiye teşkilatları, endüstriyel tesisler ve havalimanları."
        },
        "ÇÖP KAMYONU": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/1.jpeg",
            imageMobile: "assets/yeni_gorseller/1.jpeg",
            intro: "Çöp kamyonları, katı atıkların toplanması ve sıkıştırılarak taşınması için tasarlanmış özel donanımlı araçlardır.",
            objectives: [
                "Hidrolik sıkıştırma sistemlerinin kullanımı",
                "Atık toplama rotası ve zaman yönetimi",
                "Araç arkası personel güvenliği ve iletişim",
                "Hijyen ve periyodik bakım prosedürleri"
            ],
            workAreas: "Belediye temizlik işleri ve özel atık yönetim firmaları."
        },
        "BETON MİKSERİ": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/6.jpeg",
            imageMobile: "assets/yeni_gorseller/6.jpeg",
            intro: "Beton mikseri (transmikser), hazır betonun özelliklerini kaybetmeden şantiyeye taşınmasını ve dökülmesini sağlayan araçtır.",
            objectives: [
                "Tambur dönüş hızı ve karışım kontrolü",
                "Beton döküm ve oluk yönetimi",
                "Şantiye içi güvenli sürüş ve manevra",
                "Mikser temizliği ve teknik bakım esasları"
            ],
            workAreas: "Hazır beton tesisleri, inşaat şantiyeleri ve altyapı projeleri."
        },
        "VİDANJÖR": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/19.jpeg",
            imageMobile: "assets/yeni_gorseller/19.jpeg",
            intro: "Vidanjör, sıvı atıkların vakumlanarak toplanması ve nakledilmesi için kullanılan donanımlı bir iş makinesidir.",
            objectives: [
                "Vakum pompası ve emiş sistemlerinin kullanımı",
                "Sıvı atık sevkiyatı ve boşaltma prosedürleri",
                "Yüksek basınçlı yıkama ve kanal açma teknikleri",
                "Operasyonel güvenlik ve sızdırmazlık kontrolü"
            ],
            workAreas: "Belediye altyapı hizmetleri, endüstriyel atık yönetimi ve özel temizlik firmaları."
        },
        "KULE VİNÇ": {
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/yeni_gorseller/23.jpeg",
            imageMobile: "assets/yeni_gorseller/23.jpeg",
            intro: "Kule vinç, özellikle yüksek katlı yapıların inşaatında ağır yüklerin dikey ve yatay taşınmasını sağlayan sabit kaldırma sistemidir.",
            objectives: [
                "Vinç kurulumu ve denge mekanizmalarını kavrama",
                "Yüksekte güvenli operasyon ve yükleme teknikleri",
                "Haberleşme ve işaretçi koordinasyonu",
                "Rüzgar hızı ve çevre koşullarına göre güvenli çalışma"
            ],
            workAreas: "Yüksek katlı bina inşaatları, büyük ölçekli şantiyeler ve liman operasyonları."
        }
    };

    function getMachineryData(name) {
        // Extra entries for machines without dedicated photos or special cases
        const extras = {
            "YÜK ASANSÖRÜ": {
                category: "İş Makinesi",
                duration: "60 Saat Eğitim",
                imageWeb: "assets/yeni_gorseller/18.jpeg",
                imageMobile: "assets/yeni_gorseller/18.jpeg",
                intro: "Yük asansörleri, fabrika ve depolarda ağır yüklerin katlar arasında güvenle taşınmasını sağlayan endüstriyel kaldırma sistemleridir.",
                objectives: [
                    "Asansör kapasitesi ve güvenli yük limitleri",
                    "Hidrolik ve elektrikli kontrol sistemlerinin kullanımı",
                    "Bakım ve arıza prosedürleri",
                    "İş güvenliği ve acil durum protokolleri"
                ],
                workAreas: "Fabrikalar, depolar, AVM'ler ve endüstriyel tesisler."
            },
            "SERDÜMEN / SAPANCI / İŞARETÇİ": {
                category: "İş Makinesi",
                duration: "30 Saat Eğitim",
                imageWeb: "assets/web/DSC07046.jpg",
                imageMobile: "assets/mobile/DSC07045.jpg",
                intro: "Vinç operasyonlarında yükün güvenli bağlanması, yönlendirilmesi ve koordinasyonunu sağlayan kritik yardımcı görev personelidir.",
                objectives: [
                    "Sapan türleri ve güvenli bağlama teknikleri",
                    "Vinç operatörü ile işaret iletişimi",
                    "Yük kapasitesi ve denge hesabı",
                    "Acil durum prosedürleri ve kurtarma teknikleri"
                ],
                workAreas: "İnşaat şantiyeleri, fabrikalar, tersaneler ve liman operasyonları."
            }
        };

        const allDetails = { ...machineryDetails, ...extras };

        const baseData = {
            title: name,
            category: "İş Makinesi",
            duration: "60 Saat Eğitim",
            imageWeb: "assets/web/DSC07062.jpg",
            imageMobile: "assets/mobile/DSC07061.jpg",
            intro: `${name} operatörlüğü eğitimi ile mesleki yeterliliğinizi en üst seviyeye taşıyın.`,
            objectives: [
                "Güvenli makine kullanımı ve operasyon yönetimi",
                "Teknik bakım ve günlük kontrol prosedürleri",
                "İş sağlığı ve güvenliği standartlarına uyum",
                "Verimli çalışma ve yakıt tasarrufu teknikleri"
            ],
            workAreas: "İnşaat, sanayi ve altyapı projeleri, lojistik merkezleri, özel işletmeler."
        };

        if (name.includes("PAMUK") || name.includes("SİLAJ") || name.includes("BİÇERDÖVER") || name.includes("ÇIRÇIR")) {
            baseData.category = "Tarım Makinesi";
        }

        return { ...baseData, ...(allDetails[name] || {}) };
    }

    const modal = document.getElementById('machinery-modal');
    let currentPageMachines = [];
    let currentMachineIndex = -1;

    function updateModalContent(name) {
        const item = getMachineryData(name);
        if (!item) return;
        
        const heroImg = document.getElementById('modal-hero-img');
        heroImg.onerror = () => { heroImg.style.display = 'none'; };
        heroImg.onload = () => { heroImg.style.display = ''; };
        
        // Use the explicit web and mobile images with srcset
        if (item.imageWeb && item.imageMobile && !item.imageWeb.includes('unsplash')) {
            heroImg.src = item.imageWeb;
            heroImg.srcset = `${item.imageMobile} 600w, ${item.imageWeb} 1200w`;
            heroImg.sizes = "(max-width: 768px) 100vw, 1200px";
        } else {
            heroImg.src = item.imageWeb || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000";
            heroImg.removeAttribute('srcset');
            heroImg.removeAttribute('sizes');
        }

        const imagePanel = document.querySelector('.modal-image-panel');
        const contentPanel = document.querySelector('.modal-content-panel');
        const headerHero = document.querySelector('.modal-header-hero');
        const modalSplit = document.querySelector('.modal-split');
        const isDesktop = window.innerWidth > 900;

        heroImg.style.objectFit = "contain";
        heroImg.style.objectPosition = "center";
        heroImg.style.paddingBottom = "0";
        heroImg.style.background = "#fff";
        heroImg.style.width = "100%";
        heroImg.style.height = "100%";
        
        if (imagePanel) {
            imagePanel.style.width = "";
            imagePanel.style.height = "";
            imagePanel.style.aspectRatio = "";
            imagePanel.style.background = "#fff";
            if (headerHero) headerHero.style.width = "";
        }
        if (contentPanel) {
            contentPanel.style.position = "";
            contentPanel.style.width = "";
            contentPanel.style.flex = "";
        }
        if (modalSplit) {
            modalSplit.style.height = "";
        }

        const catEl = document.getElementById('modal-category');
        if (catEl) catEl.textContent = item.category;
        
        const titleEl = document.getElementById('modal-title');
        if (titleEl) titleEl.textContent = item.title;
        
        const durationEl = document.getElementById('modal-duration');
        if (durationEl) durationEl.textContent = item.duration;
        
        const basisList = document.getElementById('modal-basis');
        if (basisList) basisList.innerHTML = commonLegalBasis.map(text => `<li><i data-lucide="check-circle"></i> ${text}</li>`).join('');
        
        document.getElementById('modal-objectives-intro').textContent = item.intro;
        const objectivesList = document.getElementById('modal-objectives-list');
        if (objectivesList) objectivesList.innerHTML = item.objectives.map(text => `<li><i data-lucide="arrow-right"></i> ${text}</li>`).join('');
        
        document.getElementById('modal-work-areas').textContent = item.workAreas;
        if (window.lucide) lucide.createIcons();
    }

    function openModal(name) {
        currentMachineIndex = currentPageMachines.indexOf(name);
        updateModalContent(name);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (modal) {
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        const prevBtn = modal.querySelector('.prev-btn');
        const nextBtn = modal.querySelector('.next-btn');

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentPageMachines.length > 0) {
                    currentMachineIndex = (currentMachineIndex - 1 + currentPageMachines.length) % currentPageMachines.length;
                    updateModalContent(currentPageMachines[currentMachineIndex]);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentPageMachines.length > 0) {
                    currentMachineIndex = (currentMachineIndex + 1) % currentPageMachines.length;
                    updateModalContent(currentPageMachines[currentMachineIndex]);
                }
            });
        }
    }

    // Event Listeners for Machinery Items in sub-pages
    const programItems = document.querySelectorAll('.program-item');
    currentPageMachines = Array.from(programItems).map(item => item.getAttribute('data-course')).filter(name => name);

    programItems.forEach(item => {
        const courseName = item.getAttribute('data-course');

        item.addEventListener('click', () => {
            if (courseName) openModal(courseName);
        });

        const detailBtn = item.querySelector('.detail-btn');
        if (detailBtn) {
            detailBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (courseName) openModal(courseName);
            });
        }

        const applyBtn = item.querySelector('.apply-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const chatbotWidget = document.getElementById('chatbot-widget');
                if (chatbotWidget) {
                    chatbotWidget.classList.add('active');
                    if (chatbot) chatbot.init(courseName || item.querySelector('p').textContent);
                    if (window.innerWidth <= 768) chatbotWidget.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
    });

    // Lightbox Logic for Gallery
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-grid .bento-item img');
    
    if (lightbox && galleryItems.length > 0) {
        let currentIndex = 0;
        const images = Array.from(galleryItems).map(img => img.src);

        galleryItems.forEach((item, index) => {
            item.parentElement.addEventListener('click', () => {
                currentIndex = index;
                updateLightbox();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            });
        });

        function updateLightbox() {
            lightboxImg.src = images[currentIndex];
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightbox();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightbox();
        }

        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNext();
        });

        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrev();
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });
    }
});




document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 150;

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                
                const updateCount = () => {
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 30);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});


