/* ============================================================
   SARDAR GURBANZADE — PORTFOLIO SCRIPTS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== PRELOADER =====
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 2200);
    });
    // Fallback if load already fired
    if (document.readyState === 'complete') {
        setTimeout(() => preloader.classList.add('hidden'), 2200);
    }

    // ===== CUSTOM CURSOR =====
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (cursorDot && cursorRing && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .portfolio-item, .social-btn, .skill-tag, .stat-item');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    }

    // ===== NAVBAR SCROLL + SCROLL PROGRESS =====
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.getElementById('scrollProgress');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        navbar.classList.toggle('scrolled', currentScroll > 80);
        lastScroll = currentScroll;

        // Scroll progress bar
        if (scrollProgress) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        }
    });

    // ===== MOBILE MENU =====
    const hamburger = document.querySelector('.hamburger');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-drawer a');

    function toggleMobile() {
        hamburger.classList.toggle('active');
        mobileDrawer.classList.toggle('open');
        mobileOverlay.classList.toggle('visible');
        document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    }

    function closeMobile() {
        hamburger.classList.remove('active');
        mobileDrawer.classList.remove('open');
        mobileOverlay.classList.remove('visible');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMobile);
    mobileOverlay.addEventListener('click', closeMobile);
    mobileLinks.forEach(link => link.addEventListener('click', closeMobile));

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== LIGHTBOX =====
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    let currentIndex = 0;

    const images = Array.from(portfolioItems).map(item => {
        const img = item.querySelector('img');
        return { src: img.src, alt: img.alt };
    });

    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = images[index].src;
        lightboxImg.alt = images[index].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentIndex = (currentIndex + direction + images.length) % images.length;
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
            lightboxImg.src = images[currentIndex].src;
            lightboxImg.alt = images[currentIndex].alt;
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 200);
    }

    portfolioItems.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
    });

    lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(-1);
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // ===== PORTFOLIO FILTERING =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const countEl = document.querySelector('.portfolio-count span');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            const allItems = document.querySelectorAll('.portfolio-item');
            let visibleCount = 0;

            allItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('filter-hidden');
                    item.classList.add('filter-visible');
                    item.style.position = '';
                    item.style.visibility = '';
                    visibleCount++;
                } else {
                    item.classList.remove('filter-visible');
                    item.classList.add('filter-hidden');
                }
            });

            // Update counter
            if (countEl) {
                countEl.textContent = filter === 'all' ? allItems.length : visibleCount;
            }

            // Re-initialize lightbox images for filtered items
            const visibleItems = portfolioGrid.querySelectorAll('.portfolio-item:not(.filter-hidden)');
            images.length = 0;
            visibleItems.forEach(item => {
                const img = item.querySelector('img');
                images.push({ src: img.src, alt: img.alt });
            });

            // Rebind click events for lightbox
            visibleItems.forEach((item, i) => {
                item.onclick = () => openLightbox(i);
            });
        });
    });

    // ===== SMOOTH SCROLL FOR ANCHORS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== PARALLAX FOR HERO =====
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `scale(${1.05 + scrolled * 0.0002}) translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    // ===== COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    // ===== TESTIMONIALS SLIDER =====
    const track = document.getElementById('testimonialTrack');
    const dots = document.querySelectorAll('#testimonialDots .dot');
    let currentSlide = 0;
    let autoSlideInterval;

    function goToSlide(index) {
        currentSlide = index;
        if (track) track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.getAttribute('data-index')));
            resetAutoSlide();
        });
    });

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            goToSlide((currentSlide + 1) % dots.length);
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    if (dots.length > 0) startAutoSlide();

    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Close all others
            faqItems.forEach(i => i.classList.remove('open'));
            // Toggle current
            if (!isOpen) item.classList.add('open');
        });
    });

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate sending
            const submitBtn = contactForm.querySelector('.form-submit');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccess.classList.add('show');
                // Reset after 4 seconds
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.style.display = '';
                    formSuccess.classList.remove('show');
                    submitBtn.innerHTML = '<span data-i18n="contact.form.send">Send Message</span><svg class="btn-icon" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
                    submitBtn.disabled = false;
                }, 4000);
            }, 1200);
        });
    }

    // ===== LANGUAGE SWITCHER =====
    const langSwitcher = document.getElementById('langSwitcher');
    const langBtn = document.getElementById('langBtn');
    const langOptions = document.querySelectorAll('.lang-option');
    let currentLang = 'en';

    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langSwitcher.classList.toggle('open');
        });

        document.addEventListener('click', () => {
            langSwitcher.classList.remove('open');
        });
    }

    const translations = {
        en: {
            'nav.about': 'About',
            'nav.experience': 'Experience',
            'nav.services': 'Services',
            'nav.portfolio': 'Portfolio',
            'nav.contact': 'Contact',
            'testimonials.tag': 'Testimonials',
            'testimonials.heading': 'Client <span class="section-heading-serif">Reviews</span>',
            'testimonial.1.text': 'Sardar transformed our apartment into a space we could only dream of. His attention to detail and understanding of modern aesthetics is exceptional. Every corner feels thoughtfully designed.',
            'testimonial.1.name': 'Aydan Hasanova',
            'testimonial.1.role': 'Homeowner, Baku',
            'testimonial.2.text': 'Working with Sardar on our office redesign was a fantastic experience. He brought creative solutions that maximized our space while maintaining an elegant, professional atmosphere.',
            'testimonial.2.name': 'Rashad Mammadov',
            'testimonial.2.role': 'CEO, Tech Company',
            'testimonial.3.text': 'The 3D visualizations Sardar created for our villa project were incredibly realistic. His ability to capture lighting and materials made it easy to make design decisions with confidence.',
            'testimonial.3.name': 'Nigar Aliyeva',
            'testimonial.3.role': 'Villa Owner, Novkhani',
            'faq.tag': 'FAQ',
            'faq.heading': 'Common <span class="section-heading-serif">Questions</span>',
            'faq.q1': 'What services do you offer?',
            'faq.a1': 'I offer comprehensive architectural and interior design services including space planning, 3D visualization, material selection, furniture layout, and full project coordination from concept to completion.',
            'faq.q2': 'How long does a typical project take?',
            'faq.a2': 'Project timelines vary based on scope and complexity. A single room redesign typically takes 2–4 weeks, while a full apartment or villa project can take 1–3 months from concept to final renders.',
            'faq.q3': 'Do you work with clients outside of Baku?',
            'faq.a3': 'Yes! I work with clients both locally and internationally. Remote collaboration is possible through video calls, digital mood boards, and 3D walkthroughs that make distance a non-issue.',
            'faq.q4': 'What software do you use?',
            'faq.a4': 'I primarily use AutoCAD for technical drawings, 3Ds Max with V-Ray for photorealistic 3D rendering, and SketchUp for quick concept modeling. For presentations, I use Adobe Creative Suite.',
            'faq.q5': 'How much does a project cost?',
            'faq.a5': 'Pricing depends on project scope, area size, and deliverables required. I offer flexible packages starting from consultation-only to full design + visualization. Contact me for a personalized quote.',
            'contact.form.title': 'Send a <span>Message</span>',
            'contact.form.name': 'Your Name',
            'contact.form.email': 'Your Email',
            'contact.form.message': 'Your Message',
            'contact.form.send': 'Send Message',
            'contact.form.success': 'Message sent successfully!'
        },
        az: {
            'nav.about': 'Haqqımda',
            'nav.experience': 'Təcrübə',
            'nav.services': 'Xidmətlər',
            'nav.portfolio': 'Portfolio',
            'nav.contact': 'Əlaqə',
            'testimonials.tag': 'Rəylər',
            'testimonials.heading': 'Müştəri <span class="section-heading-serif">Rəyləri</span>',
            'testimonial.1.text': 'Sərdar mənzilimizi yalnız xəyal edə biləcəyimiz bir məkana çevirdi. Detallara diqqəti və müasir estetikanı anlaması misilsizdir. Hər künc diqqətlə dizayn edilmişdir.',
            'testimonial.1.name': 'Aydan Həsənova',
            'testimonial.1.role': 'Ev sahibi, Bakı',
            'testimonial.2.text': 'Sərdarla ofis yenidən dizaynı üzərində işləmək fantastik təcrübə idi. O, yaradıcı həllər gətirdi ki, məkanımızı maksimum dərəcədə artırdı.',
            'testimonial.2.name': 'Rəşad Məmmədov',
            'testimonial.2.role': 'Direktor, Texnologiya Şirkəti',
            'testimonial.3.text': 'Sərdarın villa layihəmiz üçün yaratdığı 3D vizualizasiyalar inanılmaz dərəcədə real idi. İşıqlandırma və materialları tutma qabiliyyəti dizayn qərarlarını asanlaşdırdı.',
            'testimonial.3.name': 'Nigar Əliyeva',
            'testimonial.3.role': 'Villa sahibi, Novxanı',
            'faq.tag': 'FAQ',
            'faq.heading': 'Tez-tez <span class="section-heading-serif">Verilən Suallar</span>',
            'faq.q1': 'Hansı xidmətlər təklif edirsiniz?',
            'faq.a1': 'Məkan planlaşdırılması, 3D vizualizasiya, material seçimi, mebel yerləşdirməsi və konseptdən tamamlanmaya qədər tam layihə koordinasiyası daxil olmaqla hərtərəfli memarlıq və interyer dizayn xidmətləri təklif edirəm.',
            'faq.q2': 'Tipik bir layihə nə qədər vaxt aparır?',
            'faq.a2': 'Layihə müddətləri əhatə dairəsinə və mürəkkəbliyinə görə dəyişir. Tək otaq yenidən dizaynı adətən 2-4 həftə, tam mənzil və ya villa layihəsi isə 1-3 ay çəkir.',
            'faq.q3': 'Bakı xaricindəki müştərilərlə işləyirsiniz?',
            'faq.a3': 'Bəli! Həm yerli, həm də beynəlxalq müştərilərlə işləyirəm. Uzaqdan əməkdaşlıq video zənglər, rəqəmsal mood lövhələri və 3D gəzintilər vasitəsilə mümkündür.',
            'faq.q4': 'Hansı proqramlardan istifadə edirsiniz?',
            'faq.a4': 'Əsasən texniki çertyojlar üçün AutoCAD, fotorealistik 3D render üçün 3Ds Max + V-Ray və sürətli konsept modelləşdirmə üçün SketchUp istifadə edirəm.',
            'faq.q5': 'Layihənin qiyməti nə qədərdir?',
            'faq.a5': 'Qiymət layihənin əhatə dairəsindən, sahə ölçüsündən və tələb olunan çatdırılmalardan asılıdır. Fərdi qiymət təklifi üçün mənimlə əlaqə saxlayın.',
            'contact.form.title': 'Mesaj <span>Göndərin</span>',
            'contact.form.name': 'Adınız',
            'contact.form.email': 'E-poçtunuz',
            'contact.form.message': 'Mesajınız',
            'contact.form.send': 'Mesaj Göndər',
            'contact.form.success': 'Mesaj uğurla göndərildi!'
        },
        ru: {
            'nav.about': 'Обо мне',
            'nav.experience': 'Опыт',
            'nav.services': 'Услуги',
            'nav.portfolio': 'Портфолио',
            'nav.contact': 'Контакты',
            'testimonials.tag': 'Отзывы',
            'testimonials.heading': 'Отзывы <span class="section-heading-serif">Клиентов</span>',
            'testimonial.1.text': 'Сардар превратил нашу квартиру в пространство, о котором мы могли только мечтать. Его внимание к деталям и понимание современной эстетики исключительны.',
            'testimonial.1.name': 'Айдан Гасанова',
            'testimonial.1.role': 'Домовладелец, Баку',
            'testimonial.2.text': 'Работа с Сардаром над редизайном офиса была фантастическим опытом. Он принёс креативные решения, которые максимально использовали наше пространство.',
            'testimonial.2.name': 'Рашад Мамедов',
            'testimonial.2.role': 'Директор, IT-компания',
            'testimonial.3.text': '3D-визуализации, которые Сардар создал для нашего проекта виллы, были невероятно реалистичными. Его способность передать освещение и материалы помогла легко принимать решения.',
            'testimonial.3.name': 'Нигяр Алиева',
            'testimonial.3.role': 'Владелица виллы, Новханы',
            'faq.tag': 'Вопросы',
            'faq.heading': 'Частые <span class="section-heading-serif">Вопросы</span>',
            'faq.q1': 'Какие услуги вы предлагаете?',
            'faq.a1': 'Я предлагаю комплексные услуги по архитектурному и интерьерному дизайну, включая планировку пространства, 3D-визуализацию, подбор материалов, расстановку мебели и полную координацию проекта.',
            'faq.q2': 'Сколько времени занимает типичный проект?',
            'faq.a2': 'Сроки зависят от масштаба и сложности. Редизайн одной комнаты обычно занимает 2–4 недели, полный проект квартиры или виллы — 1–3 месяца.',
            'faq.q3': 'Вы работаете с клиентами за пределами Баку?',
            'faq.a3': 'Да! Я работаю как с местными, так и с международными клиентами. Удалённое сотрудничество возможно через видеозвонки, цифровые мудборды и 3D-туры.',
            'faq.q4': 'Какое программное обеспечение вы используете?',
            'faq.a4': 'Основные инструменты: AutoCAD для чертежей, 3Ds Max с V-Ray для фотореалистичного рендеринга и SketchUp для концептуального моделирования. Для презентаций — Adobe Creative Suite.',
            'faq.q5': 'Сколько стоит проект?',
            'faq.a5': 'Стоимость зависит от объёма проекта, площади и требуемых результатов. Я предлагаю гибкие пакеты от консультации до полного дизайна + визуализации. Свяжитесь для индивидуального расчёта.',
            'contact.form.title': 'Отправить <span>Сообщение</span>',
            'contact.form.name': 'Ваше имя',
            'contact.form.email': 'Ваш email',
            'contact.form.message': 'Ваше сообщение',
            'contact.form.send': 'Отправить',
            'contact.form.success': 'Сообщение успешно отправлено!'
        }
    };

    function setLanguage(lang) {
        currentLang = lang;
        const t = translations[lang];
        if (!t) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) {
                el.innerHTML = t[key];
            }
        });

        // Update lang button label
        const langLabel = langBtn.querySelector('span');
        if (langLabel) langLabel.textContent = lang.toUpperCase();

        // Update active state
        langOptions.forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
        });

        // Close dropdown
        langSwitcher.classList.remove('open');
    }

    langOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            setLanguage(opt.getAttribute('data-lang'));
        });
    });
});
