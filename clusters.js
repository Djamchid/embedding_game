// Clustering K-means pour découvrir les regroupements sémantiques

let clusterData = null;

// Initialiser des centroides aléatoires
function initializeCentroids(vectors, k) {
    const centroids = [];
    const used = new Set();
    
    while (centroids.length < k) {
        const idx = Math.floor(Math.random() * vectors.length);
        if (!used.has(idx)) {
            used.add(idx);
            centroids.push([...vectors[idx].vector]);
        }
    }
    
    return centroids;
}

// Calculer la distance euclidienne entre deux vecteurs
function euclideanDistance(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += (a[i] - b[i]) ** 2;
    }
    return Math.sqrt(sum);
}

// Assigner chaque point au centroïde le plus proche
function assignToClusters(vectors, centroids) {
    const assignments = [];
    
    for (const item of vectors) {
        let minDist = Infinity;
        let cluster = 0;
        
        for (let i = 0; i < centroids.length; i++) {
            const dist = euclideanDistance(item.vector, centroids[i]);
            if (dist < minDist) {
                minDist = dist;
                cluster = i;
            }
        }
        
        assignments.push(cluster);
    }
    
    return assignments;
}

// Recalculer les centroides comme moyenne des points assignés
function updateCentroids(vectors, assignments, k) {
    const newCentroids = Array(k).fill(null).map(() => 
        Array(vectors[0].vector.length).fill(0)
    );
    const counts = Array(k).fill(0);
    
    for (let i = 0; i < vectors.length; i++) {
        const cluster = assignments[i];
        counts[cluster]++;
        
        for (let j = 0; j < vectors[i].vector.length; j++) {
            newCentroids[cluster][j] += vectors[i].vector[j];
        }
    }
    
    // Calculer les moyennes
    for (let i = 0; i < k; i++) {
        if (counts[i] > 0) {
            for (let j = 0; j < newCentroids[i].length; j++) {
                newCentroids[i][j] /= counts[i];
            }
        }
    }
    
    return newCentroids;
}

// Algorithme K-means complet
function kMeans(vectors, k, maxIterations = 50) {
    let centroids = initializeCentroids(vectors, k);
    let assignments = [];
    let prevAssignments = [];
    
    for (let iter = 0; iter < maxIterations; iter++) {
        assignments = assignToClusters(vectors, centroids);
        
        // Vérifier la convergence
        if (iter > 0 && JSON.stringify(assignments) === JSON.stringify(prevAssignments)) {
            console.log(`K-means convergé après ${iter} itérations`);
            break;
        }
        
        prevAssignments = [...assignments];
        centroids = updateCentroids(vectors, assignments, k);
    }
    
    return { assignments, centroids };
}

// Organiser les résultats par clusters
function organizeClusters(words, assignments, k) {
    const clusters = Array(k).fill(null).map(() => []);
    
    for (let i = 0; i < words.length; i++) {
        clusters[assignments[i]].push(words[i]);
    }
    
    // Trier par taille décroissante
    clusters.sort((a, b) => b.length - a.length);
    
    return clusters;
}

// Calculer la cohésion intra-cluster
function calculateIntraClusterDistance(vectors, assignments, centroids) {
    let totalDistance = 0;
    let count = 0;
    
    for (let i = 0; i < vectors.length; i++) {
        const cluster = assignments[i];
        totalDistance += euclideanDistance(vectors[i].vector, centroids[cluster]);
        count++;
    }
    
    return count > 0 ? totalDistance / count : 0;
}

// Trouver les mots les plus représentatifs d'un cluster
function findRepresentativeWords(clusterWords, clusterIdx, numWords = 5) {
    if (clusterWords.length === 0) return [];
    
    // Calculer le centroïde du cluster
    const vectors = clusterWords.map(word => embeddings[word]);
    const centroid = Array(vectors[0].length).fill(0);
    
    for (const vec of vectors) {
        for (let i = 0; i < vec.length; i++) {
            centroid[i] += vec[i];
        }
    }
    
    for (let i = 0; i < centroid.length; i++) {
        centroid[i] /= vectors.length;
    }
    
    // Trouver les mots les plus proches du centroïde
    const distances = clusterWords.map(word => ({
        word,
        distance: euclideanDistance(embeddings[word], centroid)
    }));
    
    distances.sort((a, b) => a.distance - b.distance);
    
    return distances.slice(0, numWords).map(d => d.word);
}

// Fonction principale pour exécuter le clustering
function runClustering() {
    const numClusters = parseInt(document.getElementById('numClusters').value);
    
    if (numClusters < 3 || numClusters > 30) {
        alert('Veuillez choisir entre 3 et 30 clusters');
        return;
    }
    
    document.getElementById('clusterProgress').style.display = 'block';
    document.getElementById('clusterResults').style.display = 'none';
    
    setTimeout(() => {
        // Préparer les données
        const vectors = vocabulary.map(word => ({
            word,
            vector: embeddings[word]
        }));
        
        // Exécuter K-means
        console.log(`Lancement de K-means avec ${numClusters} clusters sur ${vectors.length} mots...`);
        const { assignments, centroids } = kMeans(vectors, numClusters);
        
        // Organiser les résultats
        const clusters = organizeClusters(vocabulary, assignments, numClusters);
        
        // Calculer les statistiques
        const avgDistance = calculateIntraClusterDistance(vectors, assignments, centroids);
        
        // Sauvegarder pour la visualisation
        clusterData = { assignments, centroids, clusters };
        
        // Afficher les résultats
        displayClusters(clusters, avgDistance);
        
        document.getElementById('clusterProgress').style.display = 'none';
        document.getElementById('clusterResults').style.display = 'block';
    }, 100);
}

// Afficher les clusters découverts
function displayClusters(clusters, avgDistance) {
    const container = document.getElementById('clusterList');
    container.innerHTML = '';
    
    clusters.forEach((clusterWords, idx) => {
        if (clusterWords.length === 0) return;
        
        // Trouver les mots représentatifs
        const representatives = findRepresentativeWords(clusterWords, idx, 3);
        
        const card = document.createElement('div');
        card.className = 'cluster-card';
        card.style.borderLeft = `5px solid ${getClusterColor(idx)}`;
        
        const header = document.createElement('div');
        header.className = 'cluster-header';
        header.style.color = getClusterColor(idx);
        header.textContent = `Cluster ${idx + 1} (${clusterWords.length} mots)`;
        
        // Sous-titre avec mots représentatifs
        const subtitle = document.createElement('div');
        subtitle.style.fontSize = '0.85em';
        subtitle.style.color = '#718096';
        subtitle.style.marginTop = '5px';
        subtitle.textContent = `${representatives.join(', ')}...`;
        
        const wordsContainer = document.createElement('div');
        wordsContainer.className = 'cluster-words';
        
        // Afficher jusqu'à 20 mots
        clusterWords.slice(0, 20).forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'cluster-word';
            wordSpan.textContent = word;
            wordSpan.style.cursor = 'pointer';
            wordSpan.onclick = () => {
                // Copier dans les champs d'analogie
                document.getElementById('wordA').value = word;
                switchTab('analogies');
            };
            wordsContainer.appendChild(wordSpan);
        });
        
        if (clusterWords.length > 20) {
            const more = document.createElement('span');
            more.className = 'cluster-word';
            more.style.fontStyle = 'italic';
            more.textContent = `+${clusterWords.length - 20} autres`;
            wordsContainer.appendChild(more);
        }
        
        card.appendChild(header);
        card.appendChild(subtitle);
        card.appendChild(wordsContainer);
        container.appendChild(card);
    });
}

// Afficher les statistiques détaillées
function showClusterStatistics() {
    if (!clusterData) {
        alert('Veuillez d\'abord exécuter le clustering');
        return;
    }
    
    const { clusters } = clusterData;
    const statsContainer = document.getElementById('clusterStats');
    
    // Calculer les statistiques
    const sizes = clusters.map(c => c.length).filter(s => s > 0);
    const avgSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    const minSize = Math.min(...sizes);
    const maxSize = Math.max(...sizes);
    
    statsContainer.innerHTML = `
        <h4>📊 Statistiques des clusters</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
                <strong>Nombre de clusters :</strong><br>
                <span style="font-size: 1.5em; color: #667eea;">${clusters.length}</span>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
                <strong>Taille moyenne :</strong><br>
                <span style="font-size: 1.5em; color: #48bb78;">${avgSize.toFixed(1)} mots</span>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
                <strong>Plus petit cluster :</strong><br>
                <span style="font-size: 1.5em; color: #ed8936;">${minSize} mots</span>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
                <strong>Plus grand cluster :</strong><br>
                <span style="font-size: 1.5em; color: #9f7aea;">${maxSize} mots</span>
            </div>
        </div>
    `;
}

// Palette de couleurs pour les clusters
function getClusterColor(idx) {
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#4facfe',
        '#43e97b', '#fa709a', '#fee140', '#30cfd0',
        '#a8edea', '#fed6e3', '#c471ed', '#12c2e9',
        '#f83600', '#fe8c00', '#74ebd5', '#acb6e5',
        '#ee9ca7', '#ffdde1', '#89f7fe', '#66a6ff'
    ];
    return colors[idx % colors.length];
}
