// Gestion des onglets et initialisation globale

// Fonction pour changer d'onglet
function switchTab(tabName) {
    // Masquer tous les onglets
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Désactiver tous les boutons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Activer l'onglet sélectionné
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Activer le bouton correspondant
    event.target.classList.add('active');
    
    // Actions spécifiques selon l'onglet
    if (tabName === 'visualization' && umapProjection) {
        drawVisualization();
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de l\'application...');

    // Générer les embeddings UNE SEULE FOIS
    generateSemanticEmbeddings();

    // Vérifier le résultat
    console.log(`📊 Vocabulaire chargé : ${vocabulary.length} mots`);

    // Configurer l'autocomplétion
    setupAutocomplete();

    // Mettre à jour le compteur de mots
    document.getElementById('wordCount').textContent = vocabulary.length;

    // Mettre à jour les stats
    updateStats();

    // Exemples par défaut
    document.getElementById('wordA').value = 'king';
    document.getElementById('wordB').value = 'queen';
    document.getElementById('wordC').value = 'man';

    console.log(`✅ Application prête ! ${vocabulary.length} mots chargés.`);
    console.log('📊 Fonctionnalités disponibles:');
    console.log('   - Jeu d\'analogies vectorielles');
    console.log('   - Découverte de clusters K-means');
    console.log('   - Visualisation UMAP 2D interactive');
});

// Message d'information au démarrage
window.addEventListener('load', () => {
    console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║   🧠 JEU D'EMBEDDINGS SÉMANTIQUES                        ║
    ║                                                           ║
    ║   Exploration des propriétés émergentes                  ║
    ║   dans les espaces vectoriels                            ║
    ║                                                           ║
    ║   📦 ${vocabulary.length} mots avec embeddings 50D                      ║
    ║   🎯 Analogies vectorielles                              ║
    ║   🗂️  Clustering K-means                                 ║
    ║   📊 Projection UMAP 2D                                  ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    `);
});
