document.addEventListener("DOMContentLoaded", function () {
    const currentPage = document.body.getAttribute("data-page");

    if (currentPage === "home") {
        console.log("Page d'accueil détectée");

        // Gestion des notes
        const notesTextarea = document.getElementById("notes");

        // Charger les notes depuis le localStorage
        const savedNotes = localStorage.getItem("userNotes");
        if (savedNotes !== null) {
            notesTextarea.value = savedNotes;
        }

        // Sauvegarder les notes à chaque modification
        notesTextarea.addEventListener("input", function () {
            localStorage.setItem("userNotes", this.value);
        });

        // Nettoyage du texte
        const inputArea = document.getElementById("texte_entree");
        const outputArea = document.getElementById("texte_nettoye");

        inputArea.addEventListener("input", function () {
            const cleanedText = this.value
                .replace(/\n+/g, ' ') // Supprime les retours à la ligne
                .replace(/\s+/g, ' ') // Supprime les espaces multiples
                .trim(); // Supprime les espaces autour
            outputArea.value = cleanedText;

            navigator.clipboard.writeText(cleanedText)
                .then(() => {
                    document.getElementById("copieMessage").innerText = "Texte nettoyé copié dans le presse-papier !";
                })
                .catch(() => {
                    document.getElementById("copieMessage").innerText = "Erreur lors de la copie.";
                });

            this.value = ""; // Efface la zone d'entrée
        });

        // Chronomètre
        let chronoInterval;
        let chronoTime = 0;

        // Charger le temps du chronomètre
        const savedTime = localStorage.getItem("chronoTime");
        if (savedTime !== null) {
            chronoTime = parseInt(savedTime, 10);
            updateChronoDisplay();
        }

        // Initialiser l'horloge numérique
        updateDigitalClock();

        // Fonction pour démarrer le chronomètre
        window.startChrono = function () {
            if (chronoInterval) return; // Empêche plusieurs démarrages simultanés
            chronoInterval = setInterval(() => {
                chronoTime++;
                updateChronoDisplay(); // Met à jour l'affichage
                localStorage.setItem("chronoTime", chronoTime); // Sauvegarde le temps dans localStorage
            }, 1000);
        };

        // Fonction pour arrêter le chronomètre
        window.stopChrono = function () {
            clearInterval(chronoInterval); // Stoppe l'incrémentation
            chronoInterval = null;
        };

        // Fonction pour réinitialiser le chronomètre
        window.resetChrono = function () {
            stopChrono(); // Arrête le chronomètre
            chronoTime = 0; // Réinitialise le temps
            updateChronoDisplay(); // Met à jour l'affichage
            localStorage.removeItem("chronoTime"); // Supprime du localStorage
        };

        // Fonction pour mettre à jour l'affichage du chronomètre
        function updateChronoDisplay() {
            const hours = Math.floor(chronoTime / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((chronoTime % 3600) / 60).toString().padStart(2, '0');
            const seconds = (chronoTime % 60).toString().padStart(2, '0');
            document.getElementById('chronoDisplay').textContent = `${hours}:${minutes}:${seconds}`;
        }

        // Fonction pour mettre à jour l'horloge numérique
        function updateDigitalClock() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            document.getElementById('digitalClock').textContent = `${hours}:${minutes}:${seconds}`;
        }

        // Mettre à jour l'horloge toutes les secondes
        setInterval(updateDigitalClock, 1000);
    }

    if (currentPage === "counters") {
        console.log("Page des compteurs détectée");

        // Charger les compteurs au démarrage
        for (let i = 1; i <= 10; i++) {
            const counterElement = document.getElementById(`count${i}`);
            if (counterElement) {
                const savedValue = localStorage.getItem(`count${i}`);
                if (savedValue !== null) {
                    counterElement.textContent = savedValue;
                }

                counterElement.addEventListener("blur", () => {
                    validateAndSave(counterElement);
                    counterElement.removeAttribute("contenteditable");
                });

                counterElement.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        counterElement.blur();
                    }
                });
            }
        }

        // Gérer les boutons des compteurs
        window.increment = function (counterId) {
            const counterElement = document.getElementById(counterId);
            let count = parseInt(counterElement.textContent, 10) || 0;
            counterElement.textContent = count + 1;
            saveCounters();
        };

        window.decrement = function (counterId) {
            const counterElement = document.getElementById(counterId);
            let count = parseInt(counterElement.textContent, 10) || 0;
            if (count > 0) {
                counterElement.textContent = count - 1;
                saveCounters();
            }
        };

        window.makeEditable = function (counterId) {
            const counterElement = document.getElementById(counterId);
            counterElement.setAttribute("contenteditable", "true");
            counterElement.focus();
        };

        function validateAndSave(counterElement) {
            let value = parseInt(counterElement.textContent.trim(), 10);
            if (isNaN(value) || value < 0) {
                value = 0;
            }
            counterElement.textContent = value;
            saveCounters();
        }

        function saveCounters() {
            for (let i = 1; i <= 10; i++) {
                const counterValue = document.getElementById(`count${i}`).textContent;
                localStorage.setItem(`count${i}`, counterValue);
            }
        }
    }
});
// Met à jour le total des compteurs
function updateTotal() {
    let total = 0;
    for (let i = 1; i <= 10; i++) {
        const counterValue = parseInt(document.getElementById(`count${i}`).textContent, 10) || 0;
        total += counterValue;
    }
    document.getElementById("totalCounter").textContent = total;
}

// Modifie les fonctions `increment` et `decrement` pour appeler `updateTotal`

function increment(counterId) {
    const counterElement = document.getElementById(counterId);
    let count = parseInt(counterElement.textContent, 10) || 0;
    counterElement.textContent = count + 1;
    saveCounters();
    updateTotal(); // Met à jour le total
}

function decrement(counterId) {
    const counterElement = document.getElementById(counterId);
    let count = parseInt(counterElement.textContent, 10) || 0;
    if (count > 0) {
        counterElement.textContent = count - 1;
        saveCounters();
        updateTotal(); // Met à jour le total
    }
}

// Met à jour le total lors du chargement initial
document.addEventListener("DOMContentLoaded", function () {
    updateTotal();
});