`# Projet de Réservations de Terrains

## Table des Matières

1. [Lancer le Projet](#lancer-le-projet)
2. [Conception](#conception)

- [Dictionnaire des Données](#dictionnaire-des-données)
- [Modèle Conceptuel des Données (MCD)](#modèle-conceptuel-des-données-mcd)

3. [Remarques](#remarques)
4. [Références](#références)
5. [Code Source](#code-source)

## Lancer le Projet

### Prérequis

- Installer [Node.js](https://nodejs.org/en)
- Installer [Docker](https://www.docker.com/get-started/) et [Compose](https://docs.docker.com/compose/)
- Cloner le dépôt et se placer à la racine du projet

> N'oubliez pas de supprimer le dossier `.git` si vous désirez créer votre propre dépôt à partir des sources


rm -R .git
git init `

### Lancer le Projet avec Docker Compose

1.  Dupliquer le fichier `.env.dist` et le renommer en `.env`

bashCopy code

`cp .env.dist .env`

1.  Installer les dépendances de l'application node.js et générer la documentation Swagger

bashCopy code

`pushd api
npm install
npm run swagger-autogen
popd`

1.  Démarrer le projet avec Docker Compose

bashCopy code

`docker-compose up -d`

### Tester

#### API

-   Se rendre à l'URL [localhost:5001](http://localhost:5001/)
-   Tester avec [curl](https://curl.se/)

bashCopy code

`# Web humain (HTML)
curl --include localhost:5001
# API (JSON)
curl localhost:5001`

#### Base de données

-   Utiliser le client MySQL depuis la machine hôte

bashCopy code

`mysql -uroot -proot -Dmydb -h127.0.0.1 -P5002`

-   Exécuter un script SQL en *Batch mode*

bashCopy code

`mysql -uroot -p -Dmydb -h127.0.0.1 -P5002 < script.sql`

> Penser à modifier le port si nécessaire dans le fichier `.env`

> *Machine hôte* : la machine sur laquelle s'exécutent les conteneurs Docker, *votre* machine

#### Client graphique Adminer pour la base de données MySQL

-   Le starterpack inclut [Adminer](https://www.adminer.org/)
-   Se rendre sur [http://localhost:5003](http://localhost:5003/) et se connecter avec les credentials *root* (login *root* et mot de passe *root* par défaut), ou avec ceux de l'utilisateur (`user` et `password` par défaut)

Conception
----------

### Dictionnaire des Données

| Ressource | URL | Méthodes HTTP | Paramètres d'URL/Variations | Commentaires |
| --- | --- | --- | --- | --- |
| Réservation | /reservations | GET, POST | - | Liste de toutes les réservations ou ajout d'une nouvelle réservation |
| Détails de Réservation | /reservations/:id | GET, PUT, DELETE | :id (ID de la réservation) | Obtient, met à jour ou supprime une réservation spécifique |

### Modèle Conceptuel des Données (MCD)

Remarques
---------

Ajoutez ici toute remarque ou difficulté rencontrée lors du développement.

Références
----------

-   [Express.js Documentation](https://expressjs.com/)
-   MySQL Documentation
-   [RESTful API Design - Best Practices](https://restfulapi.net/)
