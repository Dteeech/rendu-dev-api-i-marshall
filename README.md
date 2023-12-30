## Table des Matières

1. [Lancer le Projet](#lancer-le-projet)
2. [Conception](#conception)

- [Dictionnaire des Données](#dictionnaire-des-données)
- [Modèle Conceptuel des Données (MCD)](#modèle-conceptuel-des-données-mcd)

3. [Remarques](#remarques)
4. [Références](#références)

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

- Se rendre à l'URL [localhost:5001](http://localhost:5001/)
- Tester avec [curl](https://curl.se/)

bashCopy code

`# Web humain (HTML)
curl --include localhost:5001

# API (JSON)

curl localhost:5001`

#### Base de données

- Utiliser le client MySQL depuis la machine hôte

bashCopy code

`mysql -uroot -proot -Dmydb -h127.0.0.1 -P5002`

- Exécuter un script SQL en _Batch mode_

bashCopy code

`mysql -uroot -p -Dmydb -h127.0.0.1 -P5002 < script.sql`

> Penser à modifier le port si nécessaire dans le fichier `.env`

> _Machine hôte_ : la machine sur laquelle s'exécutent les conteneurs Docker, _votre_ machine

#### Client graphique Adminer pour la base de données MySQL

- Le starterpack inclut [Adminer](https://www.adminer.org/)
- Se rendre sur [http://localhost:5003](http://localhost:5003/) et se connecter avec les credentials _root_ (login _root_ et mot de passe _root_ par défaut), ou avec ceux de l'utilisateur (`user` et `password` par défaut)

## Conception

### Dictionnaire des Données

\
D'accord, voici le dictionnaire des données pour toutes les ressources :

### Dictionnaire des Données

#### Ressource : Réservation

| Ressource   | URL             | Méthodes HTTP | Paramètres d'URL/Variations | Commentaires                                                         |
| ----------- | --------------- | ------------- | --------------------------- | -------------------------------------------------------------------- |
| Réservation | `/reservations` | `GET`, `POST` | Aucun                       | Liste de toutes les réservations ou ajout d'une nouvelle réservation |

#### Ressource : Détails de Réservation

| Ressource              | URL                 | Méthodes HTTP          | Paramètres d'URL/Variations  | Commentaires                                               |
| ---------------------- | ------------------- | ---------------------- | ---------------------------- | ---------------------------------------------------------- |
| Détails de Réservation | `/reservations/:id` | `GET`, `PUT`, `DELETE` | `:id` (ID de la réservation) | Obtient, met à jour ou supprime une réservation spécifique |

#### Ressource : Court

| Ressource | URL       | Méthodes HTTP | Paramètres d'URL/Variations | Commentaires                                         |
| --------- | --------- | ------------- | --------------------------- | ---------------------------------------------------- |
| Court     | `/courts` | `GET`, `POST` | Aucun                       | Liste de tous les courts ou ajout d'un nouveau court |

#### Ressource : Détails du Court

| Ressource        | URL           | Méthodes HTTP          | Paramètres d'URL/Variations | Commentaires                                        |
| ---------------- | ------------- | ---------------------- | --------------------------- | --------------------------------------------------- |
| Détails du Court | `/courts/:id` | `GET`, `PUT`, `DELETE` | `:id` (ID du court)         | Obtient, met à jour ou supprime un court spécifique |

#### Ressource : Utilisateur

| Ressource   | URL      | Méthodes HTTP | Paramètres d'URL/Variations | Commentaires                                                    |
| ----------- | -------- | ------------- | --------------------------- | --------------------------------------------------------------- |
| Utilisateur | `/users` | `GET`, `POST` | Aucun                       | Liste de tous les utilisateurs ou ajout d'un nouvel utilisateur |

#### Ressource : Détails de l'Utilisateur

| Ressource                | URL          | Méthodes HTTP          | Paramètres d'URL/Variations | Commentaires                                              |
| ------------------------ | ------------ | ---------------------- | --------------------------- | --------------------------------------------------------- |
| Détails de l'Utilisateur | `/users/:id` | `GET`, `PUT`, `DELETE` | `:id` (ID de l'utilisateur) | Obtient, met à jour ou supprime un utilisateur spécifique |

### Modèle Conceptuel des Données (MCD)

<img width="451" alt="SCR-20231230-mjep" src="https://github.com/Dteeech/rendu-dev-api-i-marshall/assets/100597736/49a78820-333c-4bf1-a30f-e08e497af472">

## Remarques

- Il peut y avoir une erreur au lancement du container du projet dans les logs. Il suffit en général de sauvegarder un fichier.js pour que cela fonctionne.
- Je n'ai pas su comment pouvoir rendre un terrain au choix indisponible de manière temporaire.
  Un terrain indisponible ne peut accueillir de nouvelles réservations.
- Je pense j'aurai dû changer la structure de la base de données.
- Je pense qu'avoir créé des views m'a fait perdre du temps que j'aurai pû utilisé pour mieux structurer mes réponses json hal et mes requêtes.

## Références

- [Express.js Documentation](https://expressjs.com/)
- MySQL Documentation
- [RESTful API Design - Best Practices](https://restfulapi.net/)
