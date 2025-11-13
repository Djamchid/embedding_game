// Visualisation UMAP 2D interactive

let umapProjection = null;
let showLabels = false;
let hoveredWord = null;

// Exécuter la projection UMAP
async function runUMAP() {
    document.getElementById('umapProgress').style.display = 'block';
    document.getElementById('vizStats').innerHTML = '';
    
    // Petite pause pour que l'UI se mette à jour
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
        console.log('Préparation des données pour UMAP...');
        
        // Préparer les vecteurs
        const vectors = vocabulary.map(word => embeddings[word]);
        
        console.log(`Projection UMAP de ${vectors.length} vecteurs de dimension ${vectors[0].length}...`);
        
        // Configurer UMAP
        const umap = new UMAP.UMAP({
            nComponents: 2,
            nNeighbors: 15,
            minDist: 0.1,
            spread: 1.0
        });
        
        // Exécuter la projection (peut prendre du temps)
        const embedding = await umap.fitAsync(vectors, (epochNumber) => {
            // Callback optionnel pour suivre la progression
            if (epochNumber % 10 === 0) {
                console.log(`UMAP epoch ${epochNumber}`);
            }
        });
        
        console.log('Projection UMAP terminée !');
        
        // Normaliser les coordonnées pour le canvas
        umapProjection = normalizeProjection(embedding, vocabulary);
        
        // Dessiner la visualisation
        drawVisualization();
        
        // Afficher les stats
        displayVizStats();
        
        document.getElementById('umapProgress').style.display = 'none';
        
    } catch (error) {
        console.error('Erreur UMAP:', error);
        alert('Erreur lors de la projection UMAP. Voir la console pour plus de détails.');
        document.getElementById('umapProgress').style.display = 'none';
    }
}

// Normaliser les coordonnées pour qu'elles s'adaptent au canvas
function normalizeProjection(embedding, words) {
    const padding = 40;
    const canvas = document.getElementById('visualizationCanvas');
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    
    // Trouver les min/max
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    for (const point of embedding) {
        minX = Math.min(minX, point[0]);
        maxX = Math.max(maxX, point[0]);
        minY = Math.min(minY, point[1]);
        maxY = Math.max(maxY, point[1]);
    }
    
    // Normaliser
    const normalized = embedding.map((point, idx) => ({
        word: words[idx],
        x: padding + ((point[0] - minX) / (maxX - minX)) * width,
        y: padding + ((point[1] - minY) / (maxY - minY)) * height
    }));
    
    return normalized;
}

// Dessiner la visualisation
function drawVisualization() {
    if (!umapProjection) return;
    
    const canvas = document.getElementById('visualizationCanvas');
    const ctx = canvas.getContext('2d');
    
    // Effacer le canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Afficher par clusters ou non
    const showClusters = document.getElementById('showClustersViz').checked;
    
    // Dessiner les points
    umapProjection.forEach((point, idx) => {
        // Déterminer la couleur
        let color = '#667eea';
        if (showClusters && clusterData) {
            const clusterIdx = clusterData.assignments[idx];
            color = getClusterColor(clusterIdx);
        }
        
        // Point en surbrillance si survolé
        const isHovered = hoveredWord === point.word;
        const radius = isHovered ? 6 : 3;
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        
        if (isHovered) {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
    
    // Afficher les labels si demandé
    if (showLabels) {
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        // N'afficher qu'un échantillon pour éviter la surcharge
        const step = Math.max(1, Math.floor(umapProjection.length / 100));
        
        umapProjection.forEach((point, idx) => {
            if (idx % step === 0 || hoveredWord === point.word) {
                ctx.fillStyle = '#000';
                ctx.fillText(point.word, point.x, point.y - 5);
            }
        });
    }
}

// Basculer l'affichage des labels
function toggleLabels() {
    showLabels = !showLabels;
    drawVisualization();
}

// Mettre à jour la visualisation (changement de clusters)
function updateVisualization() {
    drawVisualization();
}

// Gestion des événements de souris
// Flag pour s'assurer qu'on n'attache les listeners qu'une seule fois
let canvasInteractionSetup = false;

function setupCanvasInteraction() {
    if (canvasInteractionSetup) {
        console.log('Canvas interaction déjà configurée, skip.');
        return;
    }
    canvasInteractionSetup = true;
    console.log('Configuration de l\'interaction canvas...');
    
    const canvas = document.getElementById('visualizationCanvas');
    const tooltip = document.getElementById('tooltip');
    
    canvas.addEventListener('mousemove', (e) => {
        if (!umapProjection) return;
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Trouver le point le plus proche
        let closestPoint = null;
        let minDist = 15; // Rayon de détection
        
        for (const point of umapProjection) {
            const dist = Math.sqrt((point.x - mouseX) ** 2 + (point.y - mouseY) ** 2);
            if (dist < minDist) {
                minDist = dist;
                closestPoint = point;
            }
        }
        
        if (closestPoint) {
            hoveredWord = closestPoint.word;
            
            // Afficher le tooltip
            tooltip.textContent = closestPoint.word;
            tooltip.style.display = 'block';
            tooltip.style.left = (e.clientX + 10) + 'px';
            tooltip.style.top = (e.clientY - 30) + 'px';
            
            drawVisualization();
        } else {
            hoveredWord = null;
            tooltip.style.display = 'none';
            drawVisualization();
        }
    });
    
    canvas.addEventListener('mouseleave', () => {
        hoveredWord = null;
        tooltip.style.display = 'none';
        drawVisualization();
    });
    
    canvas.addEventListener('click', (e) => {
        if (hoveredWord) {
            // Trouver les mots similaires
            const similars = findClosestWords(embeddings[hoveredWord], [hoveredWord], 10);
            
            // Afficher dans une alerte (ou on pourrait créer un panneau dédié)
            const similarWords = similars.map(s => `${s.word} (${(s.similarity * 100).toFixed(1)}%)`).join('\n');
            alert(`Mots proches de "${hoveredWord}" :\n\n${similarWords}`);
        }
    });
}

// Afficher les statistiques de la visualisation
function displayVizStats() {
    const container = document.getElementById('vizStats');
    
    if (!umapProjection) return;
    
    // Calculer quelques métriques
    const numWords = umapProjection.length;
    
    // Calculer la distance moyenne entre voisins
    let avgNeighborDist = 0;
    const numSamples = Math.min(100, numWords);
    
    for (let i = 0; i < numSamples; i++) {
        const idx = Math.floor(Math.random() * numWords);
        const point = umapProjection[idx];
        
        // Trouver les 5 plus proches voisins
        const distances = umapProjection
            .filter(p => p.word !== point.word)
            .map(p => Math.sqrt((p.x - point.x) ** 2 + (p.y - point.y) ** 2))
            .sort((a, b) => a - b)
            .slice(0, 5);
        
        avgNeighborDist += distances.reduce((a, b) => a + b, 0) / distances.length;
    }
    
    avgNeighborDist /= numSamples;
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-around; align-items: center;">
            <div>
                <strong>Mots projetés :</strong> ${numWords}
            </div>
            <div>
                <strong>Dimensions :</strong> 50D → 2D
            </div>
            <div>
                <strong>Distance moy. voisins :</strong> ${avgNeighborDist.toFixed(1)}px
            </div>
            <div>
                <span style="color: #718096; font-size: 0.9em;">
                    💡 Cliquez sur un point pour voir les mots similaires
                </span>
            </div>
        </div>
    `;
}

// Initialiser l'interaction avec le canvas au chargement
document.addEventListener('DOMContentLoaded', () => {
    setupCanvasInteraction();
});
