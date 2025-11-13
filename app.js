// Statistiques globales
var stats = {
    total: 0,
    successes: 0,
    scoreSum: 0
};

// Fonctions mathématiques pour les vecteurs
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

function findClosestWords(targetVector, excludeWords, topN) {
    excludeWords = excludeWords || [];
    topN = topN || 10;

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

// Fonction principale pour calculer l'analogie
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

// Fonction fallback : sélection aléatoire simple
function motAleatoireSimple() {
    // Tirer le premier mot au hasard
    const randomIndexA = Math.floor(Math.random() * vocabulary.length);
    const wordA = vocabulary[randomIndexA];

    // Tirer le deuxième mot au hasard (différent du premier)
    let randomIndexB;
    do {
        randomIndexB = Math.floor(Math.random() * vocabulary.length);
    } while (randomIndexB === randomIndexA);
    const wordB = vocabulary[randomIndexB];

    // Trouver les mots sémantiquement proches du premier mot
    const vecA = embeddings[wordA];
    const closeWords = findClosestWords(vecA, [wordA, wordB], 50); // Top 50 mots proches

    // Tirer le troisième mot parmi les mots proches (du même champ sémantique)
    const randomCloseIndex = Math.floor(Math.random() * Math.min(20, closeWords.length));
    const wordC = closeWords[randomCloseIndex].word;

    return { wordA, wordB, wordC };
}

// Nouvelle fonction : sélection basée sur les clusters
function motAleatoireClusters() {
    // Vérifier si les clusters sont disponibles
    if (!clusterData || !clusterData.clusters || clusterData.clusters.length < 2) {
        console.log('⚠️ Clusters non disponibles, utilisation de l\'algorithme simple');
        return motAleatoireSimple();
    }

    // Filtrer les clusters ayant au moins 3 mots
    const clustersValides = clusterData.clusters.filter(c => c.length >= 3);

    if (clustersValides.length < 2) {
        console.log('⚠️ Pas assez de clusters valides (besoin de 2 avec ≥3 mots), utilisation de l\'algorithme simple');
        return motAleatoireSimple();
    }

    // Sélectionner 2 clusters différents
    const idx1 = Math.floor(Math.random() * clustersValides.length);
    let idx2 = Math.floor(Math.random() * clustersValides.length);
    while (idx2 === idx1) {
        idx2 = Math.floor(Math.random() * clustersValides.length);
    }

    const cluster1 = clustersValides[idx1];
    const cluster2 = clustersValides[idx2];

    // Sélectionner A du cluster 1
    const indexA = Math.floor(Math.random() * cluster1.length);
    const wordA = cluster1[indexA];

    // Sélectionner C du cluster 1 (différent de A)
    let indexC = Math.floor(Math.random() * cluster1.length);
    while (indexC === indexA) {
        indexC = Math.floor(Math.random() * cluster1.length);
    }
    const wordC = cluster1[indexC];

    // Sélectionner B du cluster 2
    const indexB = Math.floor(Math.random() * cluster2.length);
    const wordB = cluster2[indexB];

    console.log(`🎯 Analogie cluster-based : A="${wordA}" et C="${wordC}" (cluster ${idx1+1}), B="${wordB}" (cluster ${idx2+1})`);

    return { wordA, wordB, wordC };
}

// Fonction principale : essaie d'utiliser les clusters, sinon fallback
function motAleatoire() {
    const result = motAleatoireClusters();

    document.getElementById('wordA').value = result.wordA;
    document.getElementById('wordB').value = result.wordB;
    document.getElementById('wordC').value = result.wordC;
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

// Permettre de presser Entrée pour calculer (seulement dans l'onglet analogies)
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab && activeTab.id === 'analogies-tab') {
            calculerAnalogie();
        }
    }
});
