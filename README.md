# 🧠 Jeu d'Embeddings - Exploration des Propriétés Émergentes

Une application interactive pour explorer les propriétés émergentes des embeddings vectoriels avec analogies, clustering automatique et visualisation 2D.

## ✨ Nouvelles Fonctionnalités

### 🎯 Onglet 1 : Analogies Vectorielles
Le jeu original d'analogies sémantiques utilisant l'arithmétique vectorielle.

**Concept** : `roi - reine + homme ≈ femme`

**Fonctionnalités** :
- Calcul d'analogies en temps réel
- Autocomplétion intelligente
- Top 10 des mots les plus proches
- Scores de similarité cosinus
- Statistiques de réussite

### 🗂️ Onglet 2 : Clusters Sémantiques

**Découverte automatique de regroupements émergents** via K-means clustering.

**Comment ça marche** :
1. L'algorithme K-means groupe automatiquement les mots par similarité vectorielle
2. Choisissez le nombre de clusters (3-30)
3. Découvrez les regroupements thématiques qui émergent naturellement
4. Cliquez sur un mot pour l'utiliser dans une analogie

**Propriétés émergentes observables** :
- Groupes géographiques (pays, villes)
- Clusters temporels (jours, mois, saisons)
- Catégories grammaticales (verbes, adjectifs)
- Domaines sémantiques (émotions, couleurs, nombres)

**Statistiques disponibles** :
- Nombre de clusters découverts
- Taille moyenne des clusters
- Distribution des mots
- Mots les plus représentatifs par cluster

### 📊 Onglet 3 : Visualisation UMAP 2D

**Projection interactive** de l'espace vectoriel 50D vers 2D.

**Techniques utilisées** :
- **UMAP** (Uniform Manifold Approximation and Projection)
  - Préserve la structure locale et globale
  - Plus moderne que t-SNE
  - Capture les relations topologiques

**Interactions** :
- 🖱️ **Survolez** les points pour voir les mots
- 🖱️ **Cliquez** sur un point pour voir les mots similaires
- 🏷️ **Activez les labels** pour voir tous les mots
- 🎨 **Colorez par clusters** pour voir les regroupements

**Ce que vous observerez** :
- **Archipels de sens** : mots similaires regroupés en îles
- **Axes sémantiques** : dimensions de signification (masculin/féminin, concret/abstrait)
- **Chemins** : transitions progressives entre concepts
- **Structures émergentes** : organisations non programmées qui émergent de la structure des données

## 🛠️ Fichiers

```
embedding_game-main/
├── index_enhanced.html       # Interface avec 3 onglets
├── styles_enhanced.css        # Styles pour la nouvelle interface
├── app.js                     # Logique du jeu d'analogies (original)
├── clusters.js                # Algorithme K-means et clustering
├── visualization.js           # Projection UMAP et canvas interactif
├── main.js                    # Gestion des onglets et initialisation
└── data_embeddings.js         # Embeddings GloVe 50D (1000+ mots)
```

## 🚀 Utilisation

1. **Ouvrir** `index_enhanced.html` dans un navigateur moderne
2. **Explorer** les 3 onglets :
   - Commencez par les analogies pour comprendre le concept
   - Découvrez les clusters pour voir les regroupements
   - Visualisez en 2D pour une vue d'ensemble

## 🎓 Concepts Pédagogiques

### Propriétés Émergentes

Ces caractéristiques **n'ont pas été programmées explicitement** mais émergent naturellement de l'apprentissage sur de grandes quantités de texte :

1. **Similarité sémantique** : Mots proches en sens → vecteurs proches
2. **Analogies** : Relations cohérentes entre paires de mots
3. **Clusters thématiques** : Organisation naturelle par domaines
4. **Géométrie du sens** : La sémantique s'encode en géométrie vectorielle

### UMAP vs PCA vs t-SNE

- **PCA** : Linéaire, préserve les distances globales, moins spectaculaire
- **t-SNE** : Préserve les proximités locales, clusters très séparés
- **UMAP** : Équilibre local/global, plus fidèle, plus rapide

## 🎨 Palette de Couleurs

Les clusters utilisent une palette de 20 couleurs distinctes pour faciliter la différenciation visuelle.

## ⚡ Performances

- **Clustering** : ~100-500ms pour 1000 mots
- **UMAP** : ~10-30 secondes pour la projection initiale
- **Rendu** : Temps réel une fois projeté

## 🔬 Pour Aller Plus Loin

**Questions à explorer** :
- Pourquoi certains mots apparaissent-ils isolés ?
- Quels axes sémantiques pouvez-vous identifier ?
- Comment les clusters changent-ils avec k différent ?
- Les regroupements correspondent-ils à vos intuitions ?
- Quelles sont les limites de ces représentations ?

**Expériences suggérées** :
1. Testez différentes valeurs de k (5, 10, 20) et observez comment les clusters se subdivisent
2. Cherchez des analogies dans différents clusters
3. Identifiez des "ponts" entre clusters (mots qui connectent deux groupes)
4. Comparez la visualisation avec et sans coloration par clusters

## 📚 Technologies

- **Embeddings** : GloVe (Global Vectors for Word Representation)
- **Clustering** : K-means (implémentation JavaScript pure)
- **Visualisation** : UMAP.js (portage JavaScript d'UMAP)
- **Interface** : HTML5 Canvas, CSS3, Vanilla JavaScript

## 🎯 Objectif Pédagogique

Comprendre intuitivement comment les modèles de langage encodent la sémantique en géométrie, et observer les propriétés remarquables qui émergent de cette représentation vectorielle.

---

**Version améliorée** - Novembre 2025
