# 🚀 Guide de Démarrage Rapide

## Installation

**Aucune installation requise !** Ouvrez simplement `index_enhanced.html` dans votre navigateur.

## Fichiers Nécessaires

Assurez-vous que tous ces fichiers sont dans le même dossier :

```
📁 votre-dossier/
  ├── index_enhanced.html      ← OUVREZ CE FICHIER
  ├── styles_enhanced.css
  ├── app.js
  ├── clusters.js
  ├── visualization.js
  ├── main.js
  └── data_embeddings.js       (fichier volumineux ~1MB)
```

## Premiers Pas

### 1️⃣ Onglet Analogies (démarrage par défaut)

**Essayez ces exemples** :

```
king - queen + man = woman
paris - france + germany = berlin  
walked - walk + run = ran
```

**Astuce** : Commencez à taper et l'autocomplétion vous aidera !

### 2️⃣ Onglet Clusters

1. Cliquez sur **"🗂️ Clusters Sémantiques"**
2. Choisissez **10 clusters** pour commencer
3. Cliquez sur **"🔍 Découvrir les clusters"**
4. Attendez 1-2 secondes
5. **Explorez** les regroupements qui émergent !

**Ce que vous devriez observer** :
- Des groupes de pays ensemble
- Des nombres regroupés
- Des verbes d'action ensemble
- Des concepts abstraits proches

### 3️⃣ Onglet Visualisation

1. Cliquez sur **"📊 Visualisation 2D"**
2. Cliquez sur **"🎨 Générer la projection UMAP"**
3. **Attendez 10-30 secondes** (c'est normal !)
4. Une fois terminé, **explorez** :
   - Survolez les points pour voir les mots
   - Cliquez sur un point pour voir ses voisins
   - Activez "Colorer par clusters" après avoir fait un clustering

## Astuces

### 🎯 Pour les Analogies
- Utilisez l'autocomplétion (tapez 2-3 lettres)
- Testez des relations similaires (pays/capitales, genres, temps verbaux)
- Le score > 70% indique une bonne analogie

### 🗂️ Pour les Clusters
- Commencez avec 8-12 clusters
- Trop peu (< 5) : clusters trop larges et hétérogènes
- Trop (> 20) : fragmentation excessive
- Cliquez sur un mot dans un cluster pour l'utiliser dans une analogie !

### 📊 Pour la Visualisation
- **PREMIÈRE FOIS** : Lancez UMAP d'abord, puis le clustering
- Ensuite vous pouvez activer "Colorer par clusters"
- Les mots proches visuellement sont proches sémantiquement
- Cherchez des "îles" de concepts similaires

## Troubleshooting

### ❌ "La page ne charge pas"
→ Vérifiez que tous les fichiers sont dans le même dossier

### ❌ "UMAP ne fonctionne pas"
→ Vérifiez votre connexion internet (besoin de charger umap-js depuis CDN)
→ Essayez avec un navigateur récent (Chrome, Firefox, Edge, Safari)

### ❌ "C'est lent"
→ Normal pour UMAP (10-30s)
→ Le clustering est rapide (< 2s)
→ Une fois fait, tout est instantané !

## Concepts Clés

### 🧮 Embeddings
Chaque mot = vecteur de 50 nombres. Les mots similaires ont des vecteurs proches.

### 🎯 Analogie
`vecteur(C) + vecteur(B) - vecteur(A) ≈ vecteur(D)`
La relation A→B est appliquée à C pour trouver D

### 🗂️ K-means
Algorithme qui groupe automatiquement les mots par similarité vectorielle

### 📊 UMAP
Technique moderne pour "aplatir" un espace à 50 dimensions en 2D tout en préservant les proximités

## Pour les Enseignants

Cette application illustre :
- La représentation vectorielle du langage
- Les propriétés émergentes des embeddings
- L'apprentissage non supervisé (clustering)
- La réduction de dimensionnalité
- La visualisation de données haute dimension

**Niveau** : Lycée → Université
**Durée** : 30-60 minutes d'exploration

## Limites Connues

- Les embeddings sont entraînés sur des textes anglais, donc biaisés vers la culture anglophone
- UMAP peut donner des résultats légèrement différents à chaque exécution
- Tous les mots ne sont pas dans la base (1000+ mots les plus fréquents)
- Les clusters dépendent de l'initialisation aléatoire de K-means

## Support

Pour des questions ou des problèmes :
1. Consultez le README.md complet
2. Vérifiez la console du navigateur (F12) pour des messages d'erreur
3. Essayez avec un navigateur différent

---

**Amusez-vous bien avec l'exploration des embeddings ! 🚀**
