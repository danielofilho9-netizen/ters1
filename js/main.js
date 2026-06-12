/**
 * Fibra Tecnologia - Script Principal
 * Aprimorado com Tema Escuro, Modais, FAQ Accordion, Testemunhos e Validação de Formulário.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 0. CONTROLE DO TEMA (CLARO/ESCURO)
    // ==========================================================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Recupera o tema do localStorage ou define como padrão escuro
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.remove('dark-theme');
    } else {
        body.classList.add('dark-theme');
        if (!currentTheme) {
            localStorage.setItem('theme', 'dark');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
    }


    // ==========================================================================
    // 1. MENU MOBILE
    // ==========================================================================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Fecha o menu ao clicar em qualquer um dos links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }



    // ==========================================================================
    // 2. INDICADOR DE SCROLL EM FIBRA ÓPTICA & DOTS
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const fiberDots = document.querySelectorAll('.fiber-nav-dot');

    function updateFiberScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Evita divisão por zero caso a página seja muito pequena
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        document.documentElement.style.setProperty(
            '--scroll-progress',
            scrollPercent.toFixed(2)
        );

        // Atualiza a bolinha ativa da fibra de acordo com a seção visível
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // offset para antecipar a troca
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            fiberDots.forEach(dot => {
                if (dot.getAttribute('data-target') === currentSectionId) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            // Atualiza também o menu principal
            document.querySelectorAll('.nav-links a').forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${currentSectionId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }

    window.addEventListener('scroll', updateFiberScroll, { passive: true });
    updateFiberScroll();


    // ==========================================================================
    // 3. CARROSSEIS DE SERVIÇOS (SLIDERS) COM AUTO-PLAY E DOTS
    // ==========================================================================
    const sliders = document.querySelectorAll('.slider-container');
    
    sliders.forEach(slider => {
        const images = slider.querySelectorAll('.slide-img');
        const btnPrev = slider.querySelector('.btn-prev');
        const btnNext = slider.querySelector('.btn-next');
        const dotsContainer = slider.querySelector('.slider-dots');
        
        if (images.length === 0) return;

        let currentIndex = 0;
        let autoPlayTimer = null;
        const isAutoplay = slider.getAttribute('data-autoplay') === 'true';

        // Cria os dots dinamicamente
        images.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.classList.add('slide-dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.slide-dot');

        function goToSlide(index) {
            // Ajusta o índice circularmente
            if (index >= images.length) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = images.length - 1;
            } else {
                currentIndex = index;
            }

            // Exibe apenas a imagem selecionada e atualiza o dot ativo
            images.forEach((img, idx) => {
                img.style.display = idx === currentIndex ? 'block' : 'none';
            });
            
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Inicializa o slider
        goToSlide(0);

        // Ações dos botões
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
                resetAutoPlay();
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
                resetAutoPlay();
            });
        }

        // Configuração de Auto-play
        function startAutoPlay() {
            if (isAutoplay) {
                autoPlayTimer = setInterval(() => {
                    goToSlide(currentIndex + 1);
                }, 5000); // 5 segundos
            }
        }

        function resetAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                startAutoPlay();
            }
        }

        startAutoPlay();
    });


    // ==========================================================================
    // 4. DEPOIMENTOS CARROSSEL
    // ==========================================================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.t-dot');
    let activeTestimonialIndex = 0;
    let testimonialInterval = null;

    function showTestimonial(index) {
        testimonialCards.forEach((card, idx) => {
            card.classList.toggle('active', idx === index);
        });
        testimonialDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === index);
        });
        activeTestimonialIndex = index;
    }

    if (testimonialDots.length > 0) {
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
                resetTestimonialTimer();
            });
        });

        // Setas de Navegação (Esquerda e Direita)
        const prevArrow = document.querySelector('.t-arrow.prev');
        const nextArrow = document.querySelector('.t-arrow.next');

        if (prevArrow && nextArrow) {
            prevArrow.addEventListener('click', () => {
                let prevIndex = activeTestimonialIndex - 1;
                if (prevIndex < 0) {
                    prevIndex = testimonialCards.length - 1;
                }
                showTestimonial(prevIndex);
                resetTestimonialTimer();
            });

            nextArrow.addEventListener('click', () => {
                let nextIndex = activeTestimonialIndex + 1;
                if (nextIndex >= testimonialCards.length) {
                    nextIndex = 0;
                }
                showTestimonial(nextIndex);
                resetTestimonialTimer();
            });
        }

        function startTestimonialTimer() {
            testimonialInterval = setInterval(() => {
                let nextIdx = activeTestimonialIndex + 1;
                if (nextIdx >= testimonialCards.length) nextIdx = 0;
                showTestimonial(nextIdx);
            }, 6000);
        }

        function resetTestimonialTimer() {
            if (testimonialInterval) {
                clearInterval(testimonialInterval);
                startTestimonialTimer();
            }
        }

        startTestimonialTimer();
    }


    // ==========================================================================
    // 5. MODAIS DE ESPECIFICAÇÕES TÉCNICAS
    // ==========================================================================
    const specButtons = document.querySelectorAll('.btn-action-spec');
    const modals = document.querySelectorAll('.modal-overlay');

    specButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // impede scroll de fundo
            }
        });
    });

    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        
        // Fecha no botão X
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Fecha ao clicar fora do conteúdo
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Fecha modais com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });


    // ==========================================================================
    // 6. FAQ ACCORDION (ACORDEÃO)
    // ==========================================================================
    const faqHeaders = document.querySelectorAll('.faq-header');

    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const faqItem = header.parentElement;
            
            // Fecha todos os outros itens do FAQ
            faqHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherHeader.parentElement.classList.remove('active');
                }
            });

            // Alterna o estado do item clicado
            header.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
            faqItem.classList.toggle('active', !isExpanded);
        });
    });


    // ==========================================================================
    // 7. FORMULÁRIO DE CONTATO COM VALIDAÇÃO & SIMULAÇÃO DE SUBMIT
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toastNotification');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');

            inputs.forEach(input => {
                const group = input.parentElement;
                
                // Validação simples de preenchimento
                if (!input.value.trim()) {
                    group.classList.add('error');
                    isValid = false;
                } else {
                    group.classList.remove('error');
                }

                // Validação específica de email
                if (input.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        group.classList.add('error');
                        isValid = false;
                    }
                }
            });

            if (isValid) {
                const submitBtn = contactForm.querySelector('.btn-submit');
                submitBtn.classList.add('loading');

                const name = document.getElementById('form-name').value.trim();
                const senderEmail = document.getElementById('form-email').value.trim();
                const subject = document.getElementById('form-subject').value.trim();
                const message = document.getElementById('form-message').value.trim();

                const mailtoBody = `Nome: ${name}\nE-mail: ${senderEmail}\n\nMensagem:\n${message}`;
                const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=comercial@fibratecnologia.com.br&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

                // Simula requisição para API de envio (1.5 segundos) e abre o Gmail
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    
                    // Exibe a mensagem de sucesso (Toast)
                    if (toast) {
                        toast.classList.add('show');
                        setTimeout(() => {
                            toast.classList.remove('show');
                        }, 4000); // esconde em 4s
                    }

                    // Limpa formulário
                    contactForm.reset();

                    // Abre a tela de escrever e-mail do Gmail em uma nova aba
                    window.open(gmailLink, '_blank');
                }, 1500);
            }
        });

        // Limpa estado de erro ao digitar
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.parentElement.classList.remove('error');
            });
        });
    }


    // ==========================================================================
    // 8. RODAPÉ - ANO DINÂMICO
    // ==========================================================================
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ==========================================================================
    // 9. CARROSSEL DE PARCEIROS (ESTADOS ISOLADOS E LOOP ENCAPSULADO)
    // ==========================================================================
    const partnersSection = document.getElementById('parceiros-sessao');
    if (partnersSection) {
        const carouselLines = partnersSection.querySelectorAll('.partners-carousel, .ticker-container');

        carouselLines.forEach(line => {
            const track = line.querySelector('.ticker-track');
            const firstGroup = line.querySelector('.ticker-group');
            if (!track || !firstGroup) return;

            const cards = line.querySelectorAll('.ticker-logo, .partner-card');
            const isReverse = line.classList.contains('reverse');
            const defaultSpeed = isReverse ? 0.8 : -0.8;

            let x = isReverse ? -firstGroup.offsetWidth : 0;
            let currentSpeed = defaultSpeed;
            let isPaused = false;
            let activeSpeedZone = null;
            let w = firstGroup.offsetWidth;

            // Recalcula o ponto de loop caso a janela seja redimensionada
            window.addEventListener('resize', () => {
                w = firstGroup.offsetWidth;
            });

            // Cada linha tem seu estado de hover (pausa) independente
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    isPaused = true;
                });
                card.addEventListener('mouseleave', () => {
                    isPaused = false;
                });
            });

            // Detecta a posição do mouse para esta linha específica de forma 100% independente
            const handleMouseMove = (e) => {
                const rect = line.getBoundingClientRect();
                const isMouseOverLine = e.clientY >= rect.top && e.clientY <= rect.bottom;
                
                if (isMouseOverLine) {
                    const xPercent = (e.clientX - rect.left) / rect.width;
                    if (xPercent <= 0.15) {
                        activeSpeedZone = 'left';
                    } else if (xPercent >= 0.85) {
                        activeSpeedZone = 'right';
                    } else {
                        activeSpeedZone = null;
                    }
                } else {
                    activeSpeedZone = null;
                }
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseleave', () => {
                activeSpeedZone = null;
            });

            // Inicializa a translação inicial após um pequeno delay
            setTimeout(() => {
                w = firstGroup.offsetWidth;
                x = isReverse ? -w : 0;
            }, 100);

            // Animação e física isoladas por linha
            function animate() {
                if (!isPaused) {
                    if (activeSpeedZone === 'right') {
                        currentSpeed = -4.5; // Acelera rápido para a esquerda
                    } else if (activeSpeedZone === 'left') {
                        currentSpeed = 4.5; // Inverte fluxo e acelera rápido para a direita
                    } else {
                        currentSpeed = defaultSpeed; // Velocidade suave padrão
                    }

                    x += currentSpeed;

                    // Lógica de loop infinito contínuo e sem saltos por linha
                    if (currentSpeed < 0 && Math.abs(x) >= w) {
                        x += w;
                    }
                    if (currentSpeed > 0 && x >= 0) {
                        x -= w;
                    }

                    track.style.transform = `translate3d(${x}px, 0, 0)`;
                }
                requestAnimationFrame(animate);
            }

            // Aguarda carregamento inicial para disparar a animação
            setTimeout(() => {
                animate();
            }, 200);
        });
    }

});
