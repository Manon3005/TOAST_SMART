#if ! defined ( Diplome_H )
#define Diplome_H

#include <iostream>
#include <string>
using namespace std;

typedef struct Invite
{
    string nom;
    string prenom;
    char regime; //N = normal, V = vege, P = sans porc, G = sans gluten, N = vegan
} Invite;

class Diplome
{
    public:

        Diplome(string monNom,string monPrenom,string monMail)
        { 
            nom = monNom;
            prenom = monPrenom;
            mail = monMail;
            nbConvives = 0;
            nbVoisins = 0;
            nbVoisinsConvives = 0;
            convives = new Invite[15];
            voisins = new Diplome*[15];
        };

        virtual ~ Diplome()
        {
            delete[] convives;
            delete[] voisins;
        };

        Diplome(const Diplome&);
        bool operator ==(const Diplome&) const;
        friend ostream& operator <<(ostream&, const Diplome&);
        void AjouterConvive(Invite&);
        void AjouterVoisin(Diplome*);
        
        friend class Billetterie;
        friend class PlanTable;

    protected:

        string nom;
        string prenom;
        string mail;
        int nbConvives;
        int nbVoisins;
        int nbVoisinsConvives;
        Invite* convives;
        Diplome** voisins;
};


#endif