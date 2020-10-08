# Site de gestion de tickets

1. Tu t'identifies sur mongodb
2. Si ce n'est pas déjà fait, tu crées une nouvelle organisation
3. Tu crées un nouveau projet en cliquant sur la feuille verte

4. Tu cliques sur "Build a cluster" et tu choisis un type de cluster gratuit
5. Si tu as choisi le type de cluster gratuit, ensuite tu changes le nom du cluster
6. Si ce n'est pas déjà fait, tu vas dans la zone "Database access" du cluster, et tu crées un utilisateur de ta base de données tel que "root" avec un password "root"
Tu peux aussi le faire dans "Clusters" (Connect/Connect your application)
7. Si ce n'est pas déjà fait, tu vas dans "database access" du cluster et tu ajoutes ton adresse IP
Tu peux aussi le faire dans "Clusters" (Connect/Connect your application)
8. Si tout a bien fonctionné, tu vas dans "Clusters" (Connect/Connect your application) et tu récupères l'adresse du cluster à coller dans ton server.js
9. Tu ouvres le server.js dans ton repository et tu colles l'adresse du cluster et de la base de donnees. Tu remplaces d'abord le mot de passe d'utilisateur puis le nom de la base de donnees, par exemple "root" et "nomdemabasededonnees"
10. Tu fais un 
```
npm start
```
11. Tu ouvres le localhost:8000 dans le navigateur

12. Il faut faire une premiere inscription et aussi inscrire un nouvel utilisateur dont l'adresse est myemail@email.fr ou une adresse que tu choisis et que tu pux changer dans le controllers/account/root.js
13. Si tu as besoin que plusieurs utilisateurs soient root ou que un utilisatur soit root, tu peux ajouter son adresse email dans controller/account/root.js. Ce fichier est utilisé est utilisé pour donner des droits aux superutilisateurs.
14. Si tu y as fait des changements, tu refais un 
```
npm start
```
15. En testant l'application, tu peux ajouter de nouveaux tickets et tu peux voir que si tu es admin tu valider les tickets des utilisateurs lambda, te reconnecter si tu n'es pas root pour voir les tickets sans responsable, commenter un ticket, changer le responsable du ticket si tu es root

Bonne navigation !!
