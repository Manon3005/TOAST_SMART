import React from 'react';



export function Explanation() {


    return (
        <div className="explanation-container">
            <div className="explanation-header">
            <h1>Comment TOAST fonctionne ?</h1>
            </div>
            <div className="explanation-content">
            <div className="explanation-step">
                <div className="image-container">
                <img src="img/explanation.png" className="step-image1" />
                </div>
                <div className="step-text">
                <p>
                    Afin d'entamer la création de votre plan de table, il vous faut
                    importer un fichier .csv correspondant à la liste des participants
                    au dîner. Ce fichier .csv peut être exporté depuis Excel en
                    enregistrant le fichier sous le format "CSV UTF-8 (délimité par des
                    virgules) (*.csv)".
                </p>
                <p>Le fichier .csv doit contenir les colonnes suivantes :</p>
                <ul>
                    <li>Numéro du billet</li>
                    <li>Nom du participant</li>
                    <li>Prénom du participant</li>
                    <li>Nom de l'acheteur du billet</li>
                    <li>Prénom de l'acheteur du billet</li>
                    <li>Adresse e-mail de l'acheteur du billet</li>
                    <li>Régime alimentaire du participant</li>
                    <li>Champ mentionnant les personnes avec qui le participant veut manger</li>
                </ul>
                <p>
                    Une fois le fichier importé, nous détectons des erreurs dans
                    l'association des colonnes et des erreurs dans l'identification de
                    l'acheteur (un acheteur est une personne pour laquelle les champs
                    nom et prénom du participant sont égaux à ceux de l'acheteur). Pour
                    y remédier, il vous faudra modifier manuellement le fichier.
                </p>
                </div>
            </div>

            <div className="explanation-step">
                <div className="step-text">
                <p>
                    Si le fichier est correct, vous accédez à la deuxième étape de
                    l'analyse : la gestion des conflits. Notre application va analyser
                    les préférences de voisinage des participants et traiter
                    automatiquement les demandes pour lesquelles nous retrouvons
                    exactement le bon nom et prénom du participant mentionné dans la
                    liste de participants.
                </p>
                <p>
                    Dans le cas où la correspondance n'est pas exacte (faute
                    d'orthographe…), notre application vous proposera la correspondance
                    la plus proche, que vous pourrez valider ou refuser (la
                    correspondance peut se faire par rapport à un étudiant ou par
                    rapport à l'un de ses invités). Vous pourrez également compléter la
                    liste des préférences manuellement à partir d'un menu déroulant avec
                    tous les diplômés. Cette dernière étape est à réaliser en premier
                    pour chaque conflit rencontré.
                </p>
                <p>
                    Une fois tous les conflits résolus, un fichier .csv intermédiaire
                    correspondant à votre fichier initial à jour, avec les modifications
                    apportées par la résolution des conflits, est généré. Vous pourrez
                    ré-importer ce fichier à la première étape si vous souhaitez
                    reprendre votre démarche plus tard (il n'y aura donc plus de conflit
                    à gérer).
                </p>
                </div>
                <div className="image-container">
                <img src="img/explanation.png" className="step-image2" />
                </div>
            </div>

            <div className="explanation-step">
                <div className="image-container">
                <img src="img/explanation.png" className="step-image1" />
                </div>
                <div className="step-text">
                <p>
                    Vous pouvez à présent générer automatiquement un plan de table,
                    après avoir rempli le nombre de tables maximum dont vous disposez
                    pour l'événement, et le remplissage maximal d'une table. Vous avez
                    la possibilité de guider ce remplissage selon plusieurs critères :
                    satisfaire un maximum de demandes des participants, satisfaire un
                    maximum de participants différents, minimiser le nombre de tables
                    utilisées ou encore traiter en priorité les participants ayant peu
                    d'invités.
                </p>
                <p>
                    Le plan de table est généré via le bouton "Générer une solution"
                    sous forme d'un .csv contenant une ligne par diplômé et le
                    placement associé. Chaque table est identifiée par un numéro. Par la
                    même occasion, nous générons un fichier .csv dans lequel nous
                    suggérons des regroupements de tables à placer à proximité afin de
                    rapprocher des invités qui souhaitent manger à la même table mais
                    que nous n'avons pas pu satisfaire.
                </p>
                <p>
                    Vous avez la possibilité de modifier manuellement le plan de table
                    proposé dans le fichier, en modifiant la colonne "Table" et en
                    important le fichier ainsi modifié avec le bouton "Importer une
                    solution" (attention : vous ne pouvez pas importer le fichier de
                    regroupements de tables). Les statistiques de satisfaction sont
                    mises à jour, afin de vous permettre de comparer votre solution à la
                    solution générée automatiquement.
                </p>
                <p>
                    Lorsque la solution importée vous convient, vous pouvez appuyer sur
                    le bouton "Exporter le plan de table" afin de générer un fichier
                    .csv où figurent une liste de chaque table avec les participants qui
                    y mangent.
                </p>
                </div>
            </div>
            </div>
        </div>
    );
}