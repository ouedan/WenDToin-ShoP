// ===== FONCTIONS GLOBALES =====

// Fonction mot de passe admin
function demanderMotDePasse() {
    const motDePasse = prompt('Entrez le mot de passe administrateur :');
    const motDePasseCorrect = 'Maroquinerie2024'; // MODIFIEZ ICI SI BESOIN
    
    if (motDePasse === motDePasseCorrect) {
        window.location.href = 'modifier.html';
    } else if (motDePasse !== null) {
        alert('Mot de passe incorrect');
    }
}

// ===== INITIALISATION AU CHARGEMENT =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVIGATION SMOOTH =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if(this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if(target) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    history.pushState(null, null, this.getAttribute('href'));
                }
            }
        });
    });
    
    // ===== GESTION DU FORMULAIRE =====
    const form = document.querySelector('form[name="commande-sac"]');
    if(form) {
        // Sauvegarde automatique des données
        const savedData = JSON.parse(localStorage.getItem('formData') || '{}');
        Object.keys(savedData).forEach(key => {
            const field = form.elements[key];
            if(field) field.value = savedData[key];
        });
        
        // Sauvegarde à chaque modification
        form.addEventListener('input', function() {
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                if(key !== 'bot-field') data[key] = value;
            });
            localStorage.setItem('formData', JSON.stringify(data));
        });
        
        // Validation à la soumission
        form.addEventListener('submit', function(e) {
            const required = form.querySelectorAll('[required]');
            let isValid = true;
            
            // Vérification des champs requis
            required.forEach(field => {
                if(!field.value.trim()) {
                    field.style.borderColor = '#ff6b6b';
                    isValid = false;
                } else {
                    field.style.borderColor = '';
                }
            });
            
            // Validation email
            const emailField = form.querySelector('#email');
            if(emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!emailRegex.test(emailField.value)) {
                    emailField.style.borderColor = '#ff6b6b';
                    alert('Veuillez entrer une adresse email valide');
                    isValid = false;
                }
            }
            
            if(!isValid) {
                e.preventDefault();
                alert('Veuillez remplir correctement tous les champs obligatoires (*)');
                return;
            }
            
            // Animation du bouton d'envoi
            localStorage.removeItem('formData');
            const btn = form.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            btn.disabled = true;
            
            // Réinitialisation après 3 secondes (au cas où)
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 3000);
        });
        
        // Réinitialisation des bordures à la saisie
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        });
    }
    
    // ===== GESTION DES ANCRES AU CHARGEMENT =====
    window.addEventListener('load', function() {
        if(window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if(target) {
                setTimeout(() => {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    });
    
    // ===== ANIMATION DES PRODUITS AU SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les produits
    document.querySelectorAll('.produit').forEach(produit => {
        produit.style.opacity = '0';
        produit.style.transform = 'translateY(20px)';
        produit.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(produit);
    });
});

// ===== FONCTIONS UTILITAIRES =====

// Formater un prix
function formaterPrix(prix) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0
    }).format(prix);
}

// Vérifier si on est sur mobile
function estMobile() {
    return window.innerWidth <= 768;
}

// Ouvrir WhatsApp avec un message
function ouvrirWhatsApp(telephone, message) {
    const numeroFormatte = telephone.replace(/\s/g, '');
    const messageEncode = encodeURIComponent(message);
    window.open(`https://wa.me/${numeroFormatte}?text=${messageEncode}`, '_blank');
}

// ===== GESTION FORMULAIRE WHATSAPP =====
document.addEventListener('DOMContentLoaded', function() {
    const whatsappForm = document.querySelector('.whatsapp-form');
    
    if (whatsappForm) {
        // Désactiver la soumission normale
        whatsappForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation
            const required = whatsappForm.querySelectorAll('[required]');
            let isValid = true;
            
            required.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#ff6b6b';
                    isValid = false;
                } else {
                    field.style.borderColor = '';
                }
            });
            
            // Validation email
            const emailField = whatsappForm.querySelector('#email');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    emailField.style.borderColor = '#ff6b6b';
                    alert('Veuillez entrer une adresse email valide');
                    isValid = false;
                }
            }
            
            if (!isValid) {
                alert('Veuillez remplir tous les champs obligatoires (*)');
                return;
            }
            
            // Construire le message WhatsApp formaté
            const message = construireMessageWhatsApp();
            const messageEncode = encodeURIComponent(message);
            
            // Mettre à jour le champ caché
            const messageField = whatsappForm.querySelector('#whatsapp-message');
            messageField.value = message;
            
            // Animation du bouton
            const btn = whatsappForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Préparation...';
            btn.disabled = true;
            
            // Ouvrir WhatsApp après un court délai
            setTimeout(() => {
                const phoneNumber = '22666691482'; // VOTRE numéro sans +
                const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${messageEncode}`;
                
                window.open(whatsappURL, '_blank');
                
                // Réinitialiser le formulaire
                whatsappForm.reset();
                localStorage.removeItem('formData');
                
                // Réactiver le bouton
                btn.innerHTML = originalHTML;
                btn.disabled = false;
                
                // Message de confirmation
                alert('✅ WhatsApp s\'ouvre ! Vérifiez le message et envoyez-le.');
            }, 1000);
        });
        
        // Sauvegarde automatique des données
        whatsappForm.addEventListener('input', function() {
            const formData = new FormData(whatsappForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            localStorage.setItem('formData', JSON.stringify(data));
        });
        
        // Charger les données sauvegardées
        const savedData = JSON.parse(localStorage.getItem('formData') || '{}');
        Object.keys(savedData).forEach(key => {
            const field = whatsappForm.elements[key];
            if (field) field.value = savedData[key];
        });
    }
});

// ===== FONCTION POUR CONSTRUIRE LE MESSAGE =====
function construireMessageWhatsApp() {
    const form = document.querySelector('.whatsapp-form');
    if (!form) return '';
    
    // Récupérer les valeurs
    const nom = form.querySelector('#nom').value;
    const email = form.querySelector('#email').value;
    const telephone = form.querySelector('#telephone').value;
    const modele = form.querySelector('#modele').value;
    const personnalisation = form.querySelector('#personnalisation').value;
    const adresse = form.querySelector('#adresse').value;
    const message = form.querySelector('#message').value;
    
    // Construire le message formaté
    let whatsappMessage = `👜 COMMANDE - MAISON DE MAROQUINERIE 👜\n\n`;
    whatsappMessage += `👤 **INFORMATIONS CLIENT**\n`;
    whatsappMessage += `• Nom : ${nom}\n`;
    whatsappMessage += `• Email : ${email}\n`;
    whatsappMessage += `• Téléphone : ${telephone}\n\n`;
    
    whatsappMessage += `🛍️ **DÉTAILS DE LA COMMANDE**\n`;
    whatsappMessage += `• Modèle : ${modele}\n`;
    
    if (personnalisation.trim()) {
        whatsappMessage += `• Personnalisation : ${personnalisation}\n`;
    }
    
    whatsappMessage += `\n📍 **ADRESSE DE LIVRAISON**\n`;
    whatsappMessage += `${adresse}\n\n`;
    
    if (message.trim()) {
        whatsappMessage += `💬 **MESSAGE ADDITIONNEL**\n`;
        whatsappMessage += `${message}\n\n`;
    }
    
    whatsappMessage += `📅 Commande envoyée le : ${new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}`;
    
    return whatsappMessage;
}