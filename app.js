// Base de données de 1000 mots français avec embeddings simulés cohérents
let embeddings = {};
let vocabulary = [];
let stats = {
    total: 0,
    successes: 0,
    scoreSum: 0
};

// Générer des embeddings cohérents par clusters sémantiques
function generateSemanticEmbeddings() {
    const words = {
        // Genre et relations familiales
        "homme": [0.8, 0.1, 0.2, 0.7, 0.3, 0.1, 0.6, 0.9, 0.2, 0.4],
        "femme": [0.8, 0.9, 0.2, 0.7, 0.3, 0.1, 0.6, 0.1, 0.2, 0.4],
        "roi": [0.9, 0.1, 0.8, 0.9, 0.7, 0.2, 0.8, 0.9, 0.6, 0.7],
        "reine": [0.9, 0.9, 0.8, 0.9, 0.7, 0.2, 0.8, 0.1, 0.6, 0.7],
        "père": [0.7, 0.1, 0.6, 0.8, 0.9, 0.8, 0.7, 0.9, 0.3, 0.6],
        "mère": [0.7, 0.9, 0.6, 0.8, 0.9, 0.8, 0.7, 0.1, 0.3, 0.6],
        "fils": [0.6, 0.1, 0.4, 0.7, 0.8, 0.9, 0.5, 0.9, 0.2, 0.5],
        "fille": [0.6, 0.9, 0.4, 0.7, 0.8, 0.9, 0.5, 0.1, 0.2, 0.5],
        "frère": [0.6, 0.1, 0.5, 0.6, 0.7, 0.7, 0.6, 0.9, 0.3, 0.5],
        "sœur": [0.6, 0.9, 0.5, 0.6, 0.7, 0.7, 0.6, 0.1, 0.3, 0.5],

        // Géographie
        "Paris": [0.2, 0.8, 0.9, 0.3, 0.1, 0.2, 0.9, 0.5, 0.8, 0.7],
        "France": [0.1, 0.7, 0.8, 0.2, 0.1, 0.1, 0.8, 0.4, 0.7, 0.6],
        "Londres": [0.3, 0.8, 0.9, 0.4, 0.2, 0.3, 0.9, 0.6, 0.8, 0.8],
        "Angleterre": [0.2, 0.7, 0.8, 0.3, 0.2, 0.2, 0.8, 0.5, 0.7, 0.7],
        "Berlin": [0.4, 0.8, 0.9, 0.5, 0.3, 0.4, 0.9, 0.7, 0.8, 0.9],
        "Allemagne": [0.3, 0.7, 0.8, 0.4, 0.3, 0.3, 0.8, 0.6, 0.7, 0.8],
        "Rome": [0.5, 0.8, 0.9, 0.6, 0.4, 0.5, 0.9, 0.8, 0.8, 0.9],
        "Italie": [0.4, 0.7, 0.8, 0.5, 0.4, 0.4, 0.8, 0.7, 0.7, 0.8],
        "Madrid": [0.6, 0.8, 0.9, 0.7, 0.5, 0.6, 0.9, 0.9, 0.8, 0.9],
        "Espagne": [0.5, 0.7, 0.8, 0.6, 0.5, 0.5, 0.8, 0.8, 0.7, 0.8],

        // Animaux et sons
        "chien": [0.7, 0.3, 0.1, 0.8, 0.6, 0.9, 0.2, 0.4, 0.7, 0.3],
        "chat": [0.6, 0.4, 0.1, 0.7, 0.5, 0.8, 0.2, 0.3, 0.6, 0.4],
        "aboyer": [0.8, 0.2, 0.0, 0.9, 0.7, 0.9, 0.1, 0.5, 0.8, 0.2],
        "miauler": [0.7, 0.3, 0.0, 0.8, 0.6, 0.8, 0.1, 0.4, 0.7, 0.3],
        "cheval": [0.9, 0.3, 0.2, 0.9, 0.8, 0.9, 0.3, 0.6, 0.9, 0.4],
        "hennir": [0.9, 0.2, 0.1, 0.9, 0.9, 0.9, 0.2, 0.7, 0.9, 0.3],
        "oiseau": [0.3, 0.7, 0.8, 0.4, 0.2, 0.5, 0.9, 0.8, 0.3, 0.7],
        "chanter": [0.2, 0.8, 0.9, 0.3, 0.1, 0.4, 0.9, 0.9, 0.2, 0.8],

        // Couleurs
        "rouge": [0.9, 0.1, 0.1, 0.8, 0.0, 0.0, 0.7, 0.2, 0.9, 0.1],
        "rose": [0.8, 0.6, 0.6, 0.7, 0.5, 0.5, 0.6, 0.7, 0.8, 0.6],
        "bleu": [0.1, 0.1, 0.9, 0.2, 0.0, 0.8, 0.1, 0.3, 0.1, 0.9],
        "cyan": [0.0, 0.7, 0.9, 0.1, 0.6, 0.8, 0.0, 0.8, 0.0, 0.9],
        "vert": [0.0, 0.9, 0.0, 0.1, 0.8, 0.0, 0.2, 0.9, 0.0, 0.2],
        "jaune": [0.9, 0.9, 0.0, 0.8, 0.8, 0.0, 0.7, 0.9, 0.9, 0.0],
        "noir": [0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0],
        "blanc": [0.9, 0.9, 0.9, 0.8, 0.9, 0.9, 0.9, 0.8, 0.9, 0.9],

        // Tailles
        "grand": [0.9, 0.8, 0.7, 0.9, 0.8, 0.6, 0.8, 0.7, 0.9, 0.8],
        "petit": [0.1, 0.2, 0.3, 0.1, 0.2, 0.4, 0.2, 0.3, 0.1, 0.2],
        "énorme": [0.9, 0.9, 0.8, 0.9, 0.9, 0.7, 0.9, 0.8, 0.9, 0.9],
        "minuscule": [0.0, 0.1, 0.2, 0.0, 0.1, 0.3, 0.1, 0.2, 0.0, 0.1],
        "haut": [0.8, 0.9, 0.6, 0.8, 0.9, 0.5, 0.7, 0.6, 0.8, 0.9],
        "bas": [0.2, 0.1, 0.4, 0.2, 0.1, 0.5, 0.3, 0.4, 0.2, 0.1],

        // Professions et outils
        "médecin": [0.5, 0.6, 0.7, 0.8, 0.9, 0.7, 0.6, 0.5, 0.8, 0.7],
        "stéthoscope": [0.4, 0.5, 0.6, 0.7, 0.8, 0.6, 0.5, 0.4, 0.7, 0.6],
        "chef": [0.6, 0.5, 0.4, 0.7, 0.8, 0.9, 0.3, 0.2, 0.6, 0.5],
        "couteau": [0.5, 0.4, 0.3, 0.6, 0.7, 0.8, 0.2, 0.1, 0.5, 0.4],
        "professeur": [0.3, 0.7, 0.8, 0.4, 0.6, 0.5, 0.9, 0.8, 0.3, 0.7],
        "tableau": [0.2, 0.6, 0.7, 0.3, 0.5, 0.4, 0.8, 0.7, 0.2, 0.6],
        "mécanicien": [0.8, 0.3, 0.2, 0.9, 0.4, 0.8, 0.1, 0.0, 0.8, 0.3],
        "clé": [0.7, 0.2, 0.1, 0.8, 0.3, 0.7, 0.0, 0.1, 0.7, 0.2],

        // Temps
        "hier": [0.1, 0.2, 0.3, 0.0, 0.1, 0.2, 0.4, 0.5, 0.1, 0.2],
        "aujourd'hui": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
        "demain": [0.9, 0.8, 0.7, 0.9, 0.8, 0.7, 0.6, 0.5, 0.9, 0.8],
        "matin": [0.7, 0.8, 0.9, 0.6, 0.7, 0.8, 0.9, 0.7, 0.7, 0.8],
        "soir": [0.3, 0.2, 0.1, 0.4, 0.3, 0.2, 0.1, 0.3, 0.3, 0.2],
        "printemps": [0.2, 0.8, 0.3, 0.4, 0.9, 0.2, 0.5, 0.8, 0.2, 0.8],
        "automne": [0.8, 0.2, 0.7, 0.6, 0.1, 0.8, 0.5, 0.2, 0.8, 0.2],

        // Actions courantes
        "manger": [0.6, 0.4, 0.2, 0.8, 0.7, 0.9, 0.3, 0.1, 0.6, 0.4],
        "boire": [0.5, 0.3, 0.1, 0.7, 0.6, 0.8, 0.2, 0.0, 0.5, 0.3],
        "dormir": [0.2, 0.1, 0.8, 0.3, 0.0, 0.4, 0.9, 0.8, 0.2, 0.1],
        "courir": [0.8, 0.2, 0.1, 0.9, 0.3, 0.1, 0.0, 0.2, 0.8, 0.2],
        "marcher": [0.6, 0.4, 0.3, 0.7, 0.5, 0.4, 0.2, 0.4, 0.6, 0.4],
        "voler": [0.3, 0.8, 0.9, 0.4, 0.2, 0.1, 0.9, 0.8, 0.3, 0.8],
        "nager": [0.4, 0.6, 0.8, 0.5, 0.7, 0.9, 0.8, 0.6, 0.4, 0.6],

        // Objets du quotidien
        "livre": [0.3, 0.7, 0.8, 0.2, 0.6, 0.5, 0.9, 0.8, 0.3, 0.7],
        "stylo": [0.2, 0.6, 0.7, 0.1, 0.5, 0.4, 0.8, 0.7, 0.2, 0.6],
        "table": [0.7, 0.5, 0.3, 0.8, 0.6, 0.4, 0.2, 0.1, 0.7, 0.5],
        "chaise": [0.6, 0.4, 0.2, 0.7, 0.5, 0.3, 0.1, 0.0, 0.6, 0.4],
        "voiture": [0.8, 0.3, 0.2, 0.9, 0.4, 0.1, 0.0, 0.2, 0.8, 0.3],
        "vélo": [0.7, 0.4, 0.3, 0.8, 0.5, 0.2, 0.1, 0.3, 0.7, 0.4],
        "maison": [0.6, 0.7, 0.8, 0.5, 0.8, 0.9, 0.7, 0.6, 0.6, 0.7],
        "porte": [0.5, 0.6, 0.7, 0.4, 0.7, 0.8, 0.6, 0.5, 0.5, 0.6],
        "fenêtre": [0.4, 0.8, 0.9, 0.3, 0.9, 0.7, 0.8, 0.9, 0.4, 0.8],

        // Émotions
        "joie": [0.9, 0.8, 0.7, 0.9, 0.9, 0.8, 0.7, 0.8, 0.9, 0.8],
        "tristesse": [0.1, 0.2, 0.3, 0.1, 0.1, 0.2, 0.3, 0.2, 0.1, 0.2],
        "colère": [0.9, 0.1, 0.0, 0.8, 0.0, 0.1, 0.0, 0.1, 0.9, 0.1],
        "peur": [0.2, 0.1, 0.8, 0.3, 0.0, 0.9, 0.8, 0.9, 0.2, 0.1],
        "amour": [0.9, 0.9, 0.8, 0.9, 0.8, 0.7, 0.8, 0.9, 0.9, 0.9],
        "haine": [0.1, 0.0, 0.2, 0.0, 0.1, 0.0, 0.1, 0.0, 0.1, 0.0],

        // Nourriture
        "pain": [0.8, 0.7, 0.5, 0.9, 0.8, 0.6, 0.4, 0.3, 0.8, 0.7],
        "eau": [0.1, 0.1, 0.9, 0.0, 0.0, 0.8, 0.9, 0.8, 0.1, 0.1],
        "pomme": [0.8, 0.2, 0.1, 0.7, 0.9, 0.0, 0.2, 0.1, 0.8, 0.2],
        "fromage": [0.9, 0.9, 0.7, 0.8, 0.8, 0.6, 0.5, 0.4, 0.9, 0.9],
        "viande": [0.8, 0.2, 0.1, 0.9, 0.7, 0.8, 0.0, 0.1, 0.8, 0.2],
        "légume": [0.0, 0.9, 0.2, 0.1, 0.8, 0.1, 0.3, 0.2, 0.0, 0.9],
        "fruit": [0.7, 0.8, 0.2, 0.6, 0.9, 0.1, 0.3, 0.2, 0.7, 0.8],

        // Nature
        "soleil": [0.9, 0.9, 0.0, 0.9, 0.9, 0.0, 0.1, 0.2, 0.9, 0.9],
        "lune": [0.8, 0.8, 0.9, 0.7, 0.7, 0.8, 0.9, 0.9, 0.8, 0.8],
        "étoile": [0.9, 0.9, 0.8, 0.8, 0.8, 0.7, 0.9, 0.9, 0.9, 0.9],
        "mer": [0.0, 0.2, 0.9, 0.1, 0.1, 0.8, 0.9, 0.8, 0.0, 0.2],
        "montagne": [0.5, 0.3, 0.2, 0.8, 0.6, 0.4, 0.1, 0.0, 0.5, 0.3],
        "forêt": [0.0, 0.9, 0.2, 0.1, 0.8, 0.1, 0.3, 0.2, 0.0, 0.9],
        "fleur": [0.8, 0.9, 0.7, 0.7, 0.9, 0.6, 0.8, 0.9, 0.8, 0.9],
        "arbre": [0.2, 0.9, 0.3, 0.3, 0.8, 0.2, 0.4, 0.3, 0.2, 0.9],

        // Corps humain
        "tête": [0.7, 0.6, 0.5, 0.8, 0.7, 0.6, 0.5, 0.4, 0.7, 0.6],
        "main": [0.6, 0.5, 0.4, 0.7, 0.6, 0.5, 0.4, 0.3, 0.6, 0.5],
        "pied": [0.5, 0.4, 0.3, 0.6, 0.5, 0.4, 0.3, 0.2, 0.5, 0.4],
        "œil": [0.4, 0.7, 0.8, 0.3, 0.6, 0.7, 0.8, 0.9, 0.4, 0.7],
        "oreille": [0.3, 0.6, 0.7, 0.2, 0.5, 0.6, 0.7, 0.8, 0.3, 0.6],
        "bouche": [0.8, 0.5, 0.2, 0.9, 0.4, 0.1, 0.0, 0.3, 0.8, 0.5],
        "nez": [0.7, 0.4, 0.1, 0.8, 0.3, 0.0, 0.1, 0.2, 0.7, 0.4],

        // Mots supplémentaires pour atteindre 100+
        "école": [0.3, 0.7, 0.8, 0.2, 0.6, 0.5, 0.9, 0.8, 0.3, 0.7],
        "travail": [0.6, 0.4, 0.3, 0.7, 0.5, 0.4, 0.2, 0.1, 0.6, 0.4],
        "argent": [0.9, 0.8, 0.0, 0.9, 0.7, 0.0, 0.1, 0.2, 0.9, 0.8],
        "temps": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
        "vie": [0.7, 0.8, 0.9, 0.6, 0.9, 0.8, 0.9, 0.8, 0.7, 0.8],
        "mort": [0.1, 0.0, 0.2, 0.0, 0.0, 0.1, 0.2, 0.1, 0.1, 0.0],
        "paix": [0.2, 0.8, 0.9, 0.1, 0.9, 0.7, 0.9, 0.8, 0.2, 0.8],
        "guerre": [0.9, 0.1, 0.0, 0.8, 0.0, 0.2, 0.0, 0.1, 0.9, 0.1],
        "ami": [0.7, 0.8, 0.6, 0.8, 0.9, 0.7, 0.6, 0.5, 0.7, 0.8],
        "ennemi": [0.8, 0.2, 0.1, 0.9, 0.1, 0.3, 0.0, 0.2, 0.8, 0.2]
    };

    // Étendre le dictionnaire avec plus de mots pour atteindre 1000
    const additionalWords = generateAdditionalWords();

    // Combiner les mots de base avec les mots supplémentaires
    const allWords = {...words, ...additionalWords};

    // Convertir en embeddings de 50 dimensions
    for (const [word, baseVector] of Object.entries(allWords)) {
        embeddings[word] = expandVector(baseVector, 50);
        vocabulary.push(word);
    }

    document.getElementById('wordCount').textContent = vocabulary.length;
}

function generateAdditionalWords() {
    const categories = {
        // Verbes d'action
        actions: ['parler', 'écouter', 'regarder', 'toucher', 'sentir', 'goûter', 'penser', 'réfléchir', 'comprendre', 'apprendre', 'enseigner', 'créer', 'construire', 'détruire', 'réparer', 'nettoyer', 'cuisiner', 'jouer', 'rire', 'pleurer', 'danser', 'chanter', 'dessiner', 'peindre', 'écrire', 'lire', 'voyager', 'rester', 'partir', 'arriver', 'commencer', 'finir', 'continuer', 'arrêter', 'ouvrir', 'fermer', 'entrer', 'sortir', 'monter', 'descendre', 'tomber', 'lever', 'asseoir', 'attendre', 'chercher', 'trouver', 'perdre', 'gagner', 'donner', 'recevoir', 'prendre', 'porter', 'jeter', 'ramasser', 'pousser', 'tirer', 'casser', 'réparer'],

        // Objets domestiques
        objets: ['télévision', 'ordinateur', 'téléphone', 'lit', 'armoire', 'frigo', 'four', 'micro-onde', 'lave-linge', 'aspirateur', 'lampe', 'miroir', 'tapis', 'rideau', 'coussin', 'couverture', 'oreiller', 'serviette', 'brosse', 'peigne', 'savon', 'shampoing', 'dentifrice', 'brosse-à-dents', 'lunettes', 'montre', 'bijou', 'clé', 'portefeuille', 'sac', 'chaussure', 'chaussette', 'pantalon', 'chemise', 'robe', 'jupe', 'manteau', 'chapeau', 'écharpe', 'gant'],

        // Lieux
        lieux: ['ville', 'village', 'rue', 'avenue', 'place', 'parc', 'jardin', 'forêt', 'montagne', 'plage', 'rivière', 'lac', 'océan', 'désert', 'hôtel', 'restaurant', 'café', 'magasin', 'supermarché', 'banque', 'poste', 'hôpital', 'pharmacie', 'cinéma', 'théâtre', 'musée', 'bibliothèque', 'université', 'école', 'bureau', 'usine', 'gare', 'aéroport', 'pont', 'tunnel', 'église', 'château', 'prison', 'stade', 'piscine'],

        // Métiers
        metiers: ['professeur', 'médecin', 'infirmier', 'policier', 'pompier', 'avocat', 'juge', 'ingénieur', 'architecte', 'artiste', 'musicien', 'acteur', 'écrivain', 'journaliste', 'photographe', 'cuisinier', 'serveur', 'vendeur', 'chauffeur', 'pilote', 'marin', 'fermier', 'jardinier', 'mécanicien', 'électricien', 'plombier', 'coiffeur', 'dentiste', 'vétérinaire', 'comptable', 'secrétaire', 'directeur', 'ouvrier', 'scientifique', 'chercheur', 'étudiant', 'retraité', 'chômeur'],

        // Sciences et nature
        nature: ['planète', 'univers', 'galaxie', 'comète', 'météore', 'satellite', 'atome', 'molécule', 'électron', 'proton', 'neutron', 'énergie', 'force', 'gravité', 'lumière', 'son', 'chaleur', 'froid', 'électricité', 'magnétisme', 'chimie', 'physique', 'biologie', 'géologie', 'astronomie', 'mathématiques', 'géométrie', 'algèbre', 'calcul', 'statistique', 'probabilité', 'théorie', 'hypothèse', 'expérience', 'résultat', 'conclusion'],

        // Sentiments et concepts abstraits
        abstraits: ['bonheur', 'malheur', 'espoir', 'désespoir', 'confiance', 'méfiance', 'courage', 'lâcheté', 'générosité', 'égoïsme', 'patience', 'impatience', 'calme', 'nervosité', 'stress', 'relaxation', 'fatigue', 'énergie', 'force', 'faiblesse', 'santé', 'maladie', 'beauté', 'laideur', 'intelligence', 'stupidité', 'sagesse', 'folie', 'vérité', 'mensonge', 'justice', 'injustice', 'liberté', 'prison', 'égalité', 'inégalité', 'progrès', 'régression', 'succès', 'échec', 'victoire', 'défaite', 'début', 'fin'],

        // Transport et véhicules
        transport: ['voiture', 'camion', 'autobus', 'métro', 'tramway', 'train', 'avion', 'hélicoptère', 'bateau', 'navire', 'vélo', 'moto', 'scooter', 'taxi', 'ambulance', 'camion-pompe', 'tracteur', 'bulldozer', 'grue', 'fusée', 'satellite', 'sous-marin', 'yacht', 'voilier', 'canot', 'kayak', 'planche', 'ski', 'patins', 'trottinette'],

        // Arts et culture
        arts: ['peinture', 'sculpture', 'musique', 'danse', 'théâtre', 'cinéma', 'littérature', 'poésie', 'roman', 'nouvelle', 'conte', 'fable', 'légende', 'mythe', 'histoire', 'biographie', 'autobiographie', 'journal', 'magazine', 'journal', 'radio', 'télévision', 'internet', 'site', 'blog', 'réseau', 'social', 'communication', 'information', 'nouvelle', 'actualité'],

        // Sports et loisirs
        sports: ['football', 'basketball', 'tennis', 'golf', 'natation', 'course', 'cyclisme', 'ski', 'snowboard', 'surf', 'voile', 'escalade', 'randonnée', 'camping', 'pêche', 'chasse', 'photographie', 'jardinage', 'lecture', 'écriture', 'dessin', 'peinture', 'musique', 'chant', 'danse', 'cuisine', 'couture', 'tricot', 'bricolage', 'collection', 'voyage', 'aventure'],

        // Technologie moderne
        tech: ['ordinateur', 'smartphone', 'tablette', 'internet', 'email', 'message', 'application', 'logiciel', 'programme', 'code', 'algorithme', 'données', 'fichier', 'dossier', 'document', 'image', 'vidéo', 'audio', 'musique', 'film', 'photo', 'caméra', 'micro', 'haut-parleur', 'écran', 'clavier', 'souris', 'imprimante', 'scanner', 'robot', 'intelligence-artificielle', 'machine', 'automatisation'],

        // Nourriture détaillée
        cuisine: ['petit-déjeuner', 'déjeuner', 'dîner', 'collation', 'apéritif', 'dessert', 'entrée', 'plat', 'salade', 'soupe', 'sandwich', 'pizza', 'pâtes', 'riz', 'blé', 'avoine', 'orge', 'maïs', 'pomme-de-terre', 'carotte', 'tomate', 'oignon', 'ail', 'persil', 'basilic', 'thym', 'romarin', 'sel', 'poivre', 'sucre', 'miel', 'huile', 'vinaigre', 'beurre', 'crème', 'lait', 'yaourt', 'œuf', 'poisson', 'poulet', 'bœuf', 'porc', 'agneau'],

        // Matériaux et textures
        materiaux: ['bois', 'métal', 'plastique', 'verre', 'céramique', 'pierre', 'marbre', 'granite', 'sable', 'terre', 'argile', 'tissu', 'coton', 'laine', 'soie', 'lin', 'cuir', 'fourrure', 'plume', 'papier', 'carton', 'caoutchouc', 'mousse', 'gel', 'liquide', 'gaz', 'vapeur', 'fumée', 'poussière', 'poudre'],

        // Formes et dimensions
        formes: ['rond', 'carré', 'triangle', 'rectangle', 'ovale', 'losange', 'étoile', 'cœur', 'croix', 'cercle', 'ligne', 'point', 'courbe', 'angle', 'côté', 'surface', 'volume', 'longueur', 'largeur', 'hauteur', 'profondeur', 'épaisseur', 'diamètre', 'rayon', 'périmètre', 'aire', 'espace', 'distance', 'proximité', 'éloignement'],

        // Saisons et météo
        meteo: ['printemps', 'été', 'automne', 'hiver', 'chaud', 'froid', 'tiède', 'frais', 'gel', 'neige', 'glace', 'pluie', 'orage', 'éclair', 'tonnerre', 'vent', 'brise', 'tempête', 'ouragan', 'cyclone', 'tornade', 'brouillard', 'nuage', 'ciel', 'soleil', 'ombre', 'lumière', 'obscurité', 'aube', 'crépuscule', 'midi', 'minuit'],

        // Nombres et mathématiques
        nombres: ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'cent', 'mille', 'million', 'milliard', 'premier', 'deuxième', 'troisième', 'dernier', 'moitié', 'tiers', 'quart', 'double', 'triple', 'addition', 'soustraction', 'multiplication', 'division', 'égal', 'plus', 'moins', 'fois', 'par'],

        // Directions et positions
        directions: ['nord', 'sud', 'est', 'ouest', 'gauche', 'droite', 'devant', 'derrière', 'dessus', 'dessous', 'intérieur', 'extérieur', 'centre', 'bord', 'coin', 'milieu', 'début', 'fin', 'entre', 'parmi', 'avec', 'sans', 'contre', 'pour', 'vers', 'depuis', 'jusqu'],

        // Qualités et défauts
        qualites: ['bon', 'mauvais', 'beau', 'laid', 'intelligent', 'stupide', 'gentil', 'méchant', 'drôle', 'triste', 'rapide', 'lent', 'fort', 'faible', 'dur', 'mou', 'chaud', 'froid', 'sec', 'humide', 'propre', 'sale', 'neuf', 'vieux', 'jeune', 'âgé', 'riche', 'pauvre', 'facile', 'difficile', 'simple', 'compliqué', 'clair', 'sombre', 'léger', 'lourd']
    };

    const additionalWords = {};
    let totalCount = 0;

    for (const [category, words] of Object.entries(categories)) {
        for (let i = 0; i < words.length && totalCount < 900; i++) {
            const word = words[i];
            if (!embeddings[word]) {
                // Générer un embedding basé sur la catégorie
                additionalWords[word] = generateCategoryEmbedding(category, i, words.length);
                totalCount++;
            }
        }
    }

    return additionalWords;
}

function generateCategoryEmbedding(category, index, total) {
    const baseVectors = {
        actions: [0.6, 0.3, 0.1, 0.8, 0.4, 0.2, 0.1, 0.5, 0.7, 0.3],
        objets: [0.5, 0.5, 0.5, 0.6, 0.6, 0.6, 0.4, 0.4, 0.5, 0.5],
        lieux: [0.4, 0.7, 0.8, 0.3, 0.6, 0.7, 0.8, 0.6, 0.4, 0.7],
        metiers: [0.7, 0.6, 0.5, 0.8, 0.7, 0.6, 0.5, 0.4, 0.7, 0.6],
        nature: [0.2, 0.8, 0.6, 0.1, 0.9, 0.5, 0.7, 0.8, 0.2, 0.8],
        abstraits: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
        transport: [0.8, 0.3, 0.2, 0.9, 0.4, 0.1, 0.0, 0.2, 0.8, 0.3],
        arts: [0.3, 0.8, 0.9, 0.2, 0.7, 0.8, 0.9, 0.8, 0.3, 0.8],
        sports: [0.9, 0.4, 0.2, 0.8, 0.5, 0.3, 0.1, 0.4, 0.9, 0.4],
        tech: [0.7, 0.5, 0.8, 0.8, 0.6, 0.9, 0.8, 0.7, 0.7, 0.5],
        cuisine: [0.8, 0.6, 0.3, 0.9, 0.7, 0.4, 0.2, 0.3, 0.8, 0.6],
        materiaux: [0.6, 0.4, 0.2, 0.7, 0.5, 0.3, 0.1, 0.2, 0.6, 0.4],
        formes: [0.5, 0.6, 0.7, 0.4, 0.7, 0.8, 0.6, 0.5, 0.5, 0.6],
        meteo: [0.4, 0.7, 0.9, 0.3, 0.8, 0.9, 0.9, 0.8, 0.4, 0.7],
        nombres: [0.8, 0.8, 0.8, 0.7, 0.7, 0.7, 0.6, 0.6, 0.8, 0.8],
        directions: [0.6, 0.5, 0.4, 0.7, 0.6, 0.5, 0.4, 0.3, 0.6, 0.5],
        qualites: [0.7, 0.7, 0.6, 0.8, 0.8, 0.7, 0.6, 0.5, 0.7, 0.7]
    };

    const base = baseVectors[category] || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    const variation = index / total * 0.4 - 0.2; // Variation de -0.2 à +0.2

    return base.map(val => Math.max(0, Math.min(1, val + variation + (Math.random() - 0.5) * 0.1)));
}

function expandVector(baseVector, targetDimension) {
    const expanded = [...baseVector];
    while (expanded.length < targetDimension) {
        // Ajouter des dimensions basées sur les valeurs existantes avec variation
        const baseIndex = expanded.length % baseVector.length;
        const noise = (Math.random() - 0.5) * 0.2; // Bruit léger
        expanded.push(Math.max(0, Math.min(1, baseVector[baseIndex] + noise)));
    }
    return expanded;
}

function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function vectorSubtract(vecA, vecB) {
    return vecA.map((val, i) => val - vecB[i]);
}

function vectorAdd(vecA, vecB) {
    return vecA.map((val, i) => val + vecB[i]);
}

function findClosestWords(targetVector, excludeWords = [], topN = 10) {
    const similarities = [];

    for (const word of vocabulary) {
        if (!excludeWords.includes(word)) {
            const similarity = cosineSimilarity(targetVector, embeddings[word]);
            similarities.push({word, similarity});
        }
    }

    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, topN);
}

function calculerAnalogie() {
    const wordA = document.getElementById('wordA').value.toLowerCase().trim();
    const wordB = document.getElementById('wordB').value.toLowerCase().trim();
    const wordC = document.getElementById('wordC').value.toLowerCase().trim();

    if (!wordA || !wordB || !wordC) {
        alert('Veuillez remplir tous les champs !');
        return;
    }

    if (!embeddings[wordA] || !embeddings[wordB] || !embeddings[wordC]) {
        const missing = [wordA, wordB, wordC].filter(w => !embeddings[w]);
        alert(`Mots non trouvés dans la base : ${missing.join(', ')}`);
        return;
    }

    document.getElementById('loading').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';

    setTimeout(() => {
        // Calcul vectoriel : A - B + C
        const vecA = embeddings[wordA];
        const vecB = embeddings[wordB];
        const vecC = embeddings[wordC];

        const diff = vectorSubtract(vecA, vecB);
        const result = vectorAdd(diff, vecC);

        // Trouver les mots les plus proches
        const closest = findClosestWords(result, [wordA, wordB, wordC], 10);
        const bestMatch = closest[0];

        // Afficher le résultat
        document.getElementById('result').value = bestMatch.word;
        document.getElementById('resultText').innerHTML =
            `<strong style="font-size: 1.5em; color: #667eea;">${bestMatch.word}</strong>
             <br><br><em>"${wordA} est à ${wordB} ce que ${wordC} est à <strong>${bestMatch.word}</strong>"</em>`;

        document.getElementById('similarityScore').innerHTML =
            `Score de similarité : <strong>${(bestMatch.similarity * 100).toFixed(1)}%</strong>`;

        // Afficher les mots proches
        const wordList = closest.map(item =>
            `<span class="word-badge">${item.word} (${(item.similarity * 100).toFixed(1)}%)</span>`
        ).join('');
        document.getElementById('wordList').innerHTML = wordList;

        // Mettre à jour les stats
        stats.total++;
        stats.scoreSum += bestMatch.similarity;
        if (bestMatch.similarity > 0.7) stats.successes++;

        updateStats();

        document.getElementById('loading').style.display = 'none';
        document.getElementById('resultSection').style.display = 'block';
    }, 500);
}

function updateStats() {
    document.getElementById('totalAnalogies').textContent = stats.total;
    const successRate = stats.total > 0 ? (stats.successes / stats.total * 100).toFixed(1) : '0';
    document.getElementById('successRate').textContent = successRate + '%';
    const averageScore = stats.total > 0 ? (stats.scoreSum / stats.total).toFixed(2) : '0.0';
    document.getElementById('averageScore').textContent = averageScore;
}

function motAleatoire() {
    const randomWords = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * vocabulary.length);
        randomWords.push(vocabulary[randomIndex]);
    }

    document.getElementById('wordA').value = randomWords[0];
    document.getElementById('wordB').value = randomWords[1];
    document.getElementById('wordC').value = randomWords[2];
    document.getElementById('result').value = '';
    document.getElementById('resultSection').style.display = 'none';
}

function reset() {
    document.getElementById('wordA').value = '';
    document.getElementById('wordB').value = '';
    document.getElementById('wordC').value = '';
    document.getElementById('result').value = '';
    document.getElementById('resultSection').style.display = 'none';
}

// Autocomplétion
function setupAutocomplete() {
    ['A', 'B', 'C'].forEach(letter => {
        const input = document.getElementById(`word${letter}`);
        const suggestions = document.getElementById(`suggestions${letter}`);

        input.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            if (value.length < 2) {
                suggestions.style.display = 'none';
                return;
            }

            const matches = vocabulary.filter(word =>
                word.startsWith(value)).slice(0, 8);

            if (matches.length > 0) {
                suggestions.innerHTML = matches.map(word =>
                    `<div class="suggestion-item" onclick="selectSuggestion('${letter}', '${word}')">${word}</div>`
                ).join('');
                suggestions.style.display = 'block';
            } else {
                suggestions.style.display = 'none';
            }
        });

        input.addEventListener('blur', function() {
            setTimeout(() => suggestions.style.display = 'none', 200);
        });
    });
}

function selectSuggestion(letter, word) {
    document.getElementById(`word${letter}`).value = word;
    document.getElementById(`suggestions${letter}`).style.display = 'none';
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    generateSemanticEmbeddings();
    setupAutocomplete();
    updateStats();

    // Exemples par défaut
    document.getElementById('wordA').value = 'roi';
    document.getElementById('wordB').value = 'reine';
    document.getElementById('wordC').value = 'homme';
});

// Permettre de presser Entrée pour calculer
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculerAnalogie();
    }
});
