#if ! defined ( Billetterie_H )
#define Billetterie_H

#include <iostream>
#include <string>
#include <fstream>
#include <map>
#include "Diplome.h"

using namespace std;

#define N 500

class Billetterie
{
    friend class PlanTable;

    public:

        Billetterie(string&,string&);
        virtual ~Billetterie();
        friend ostream& operator<< (ostream&, const Billetterie&);
        void RechercheDiplome(ostream&, string&);
        void StatistiquesRegime(ostream&) const;
        void Comparaison(const Billetterie&);

        int nbDiplomes;

    protected:

        char RegimeAlimentaire(const string);
        void AjoutVoisins(const string&);
        void ExtraireVoisins(const string&,Diplome&);


        Diplome** liste;
        map <string,int> index;
        int nbVege;
        int nbSansPorc;
        int nbSansGluten;
        int nbRegimeNormal;
        int nbVegan;
};

#endif