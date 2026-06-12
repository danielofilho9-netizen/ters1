/**
 * Fibra Tecnologia - Controle de Tradução Multilíngue (PT, EN, ES)
 * Responsável por gerenciar o seletor de idiomas, aplicar as traduções nos elementos data-i18n,
 * data-i18n-placeholder e data-i18n-aria, e persistir a escolha do usuário.
 */

document.addEventListener('DOMContentLoaded', () => {
    const langSelectBtn = document.getElementById('langSelectBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const activeFlag = document.getElementById('activeFlag');
    const activeLangText = document.getElementById('activeLangText');

    // Mapeamento de bandeiras em formato emoji/texto para exibição no botão principal
    const flags = {
        pt: '🇧🇷',
        en: '🇺🇸',
        es: '🇪🇸'
    };

    const langTexts = {
        pt: 'PT',
        en: 'EN',
        es: 'ES'
    };

    // 1. FUNÇÃO PRINCIPAL DE TRADUÇÃO
    function translatePage(lang) {
        if (!window.translations || !window.translations[lang]) {
            console.error(`Dicionário de tradução não encontrado para o idioma: ${lang}`);
            return;
        }

        const dict = window.translations[lang];

        // Atualiza a tag lang do HTML
        document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;

        // Atualiza meta tags e título da página (SEO)
        if (dict['title']) document.title = dict['title'];
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && dict['description']) metaDesc.setAttribute('content', dict['description']);

        // Traduz elementos com data-i18n (conteúdo de texto/HTML)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                // Se a chave contiver tags HTML ou se for configurada para manter HTML
                if (key.includes('.rights')) {
                    // Substitui a variável do ano no rodapé
                    const currentYear = new Date().getFullYear();
                    el.innerHTML = dict[key].replace('{year}', currentYear);
                } else {
                    el.innerHTML = dict[key];
                }
            }
        });

        // Traduz placeholders de inputs/textarea
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) {
                el.setAttribute('placeholder', dict[key]);
            }
        });

        // Traduz atributos aria-label
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            if (dict[key]) {
                el.setAttribute('aria-label', dict[key]);
            }
        });

        // Atualiza o estado da validação de erro nos formulários, se existir
        updateFormErrorMessages(lang);
    }

    // Função auxiliar para atualizar as mensagens de erro nos elementos span do formulário de contato
    function updateFormErrorMessages(lang) {
        const dict = window.translations[lang];
        if (!dict) return;

        const nameError = document.querySelector('#form-name ~ .error-msg');
        const emailError = document.querySelector('#form-email ~ .error-msg');
        const subjectError = document.querySelector('#form-subject ~ .error-msg');
        const messageError = document.querySelector('#form-message ~ .error-msg');

        if (nameError && dict['contact.error_name']) nameError.textContent = dict['contact.error_name'];
        if (emailError && dict['contact.error_email']) emailError.textContent = dict['contact.error_email'];
        if (subjectError && dict['contact.error_subject']) subjectError.textContent = dict['contact.error_subject'];
        if (messageError && dict['contact.error_message']) messageError.textContent = dict['contact.error_message'];
    }

    // 2. CONTROLE DO DROPDOWN E INTERAÇÃO
    if (langSelectBtn && langDropdown) {
        // Abre/fecha dropdown ao clicar no botão principal
        langSelectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
            langSelectBtn.classList.toggle('active');
        });

        // Fecha dropdown ao clicar em qualquer lugar da tela
        document.addEventListener('click', () => {
            langDropdown.classList.remove('active');
            langSelectBtn.classList.remove('active');
        });

        // Seleção de idioma
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedLang = option.getAttribute('data-lang');

                // Salva a escolha e executa a tradução
                localStorage.setItem('language', selectedLang);
                translatePage(selectedLang);

                // Atualiza o botão visual
                activeFlag.textContent = flags[selectedLang];
                activeLangText.textContent = langTexts[selectedLang];

                // Atualiza a classe ativa nas opções do dropdown
                langOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');

                // Fecha o dropdown
                langDropdown.classList.remove('active');
                langSelectBtn.classList.remove('active');
            });
        });
    }

    // 3. INICIALIZAÇÃO DO IDIOMA PADRÃO
    function initLanguage() {
        const storedLang = localStorage.getItem('language');
        
        let defaultLang = 'pt'; // Default
        if (storedLang && ['pt', 'en', 'es'].includes(storedLang)) {
            defaultLang = storedLang;
        } else {
            // Tenta detectar o idioma do navegador do usuário
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang) {
                const prefix = browserLang.substring(0, 2).toLowerCase();
                if (['pt', 'en', 'es'].includes(prefix)) {
                    defaultLang = prefix;
                }
            }
        }

        // Aplica o idioma inicial
        translatePage(defaultLang);
        localStorage.setItem('language', defaultLang);

        // Atualiza a interface visual do seletor conforme o idioma selecionado
        if (activeFlag && activeLangText) {
            activeFlag.textContent = flags[defaultLang];
            activeLangText.textContent = langTexts[defaultLang];
        }

        if (langOptions.length > 0) {
            langOptions.forEach(option => {
                if (option.getAttribute('data-lang') === defaultLang) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }
    }

    initLanguage();
});
