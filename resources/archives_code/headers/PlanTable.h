#if ! defined ( PlanTable_H )
#define PlanTable_H

#include <iostream>
#include <string>
#include <map>
#include "Billetterie.h"
#include "Table.h"

class Diplome;
struct Invite;

class PlanTable
{

    public:
        PlanTable(int,int,int,int*,Billetterie*,string&);
        virtual ~PlanTable();
        void AjouterDiplomeTable(string&, string&);
        void AfficherCompositionTable(ostream&);
        friend ostream& operator<< (ostream&, const PlanTable&);
        void ExporterPlan(string&);
        void ImporterPlan(string&);
        void CalculNombrePersonnesPlacees(ostream&) const;

        int CalculNumeroTable(string&) const;
        string CalculNomTable(int) const;

    protected:

        int CalculNombreTable() const;
        int remplissageMin;
        int remplissageMax;
        int nbRangees;
        int* nbTablesParRangee; //mettre toutes celles possibles
        Table* tables;
        Billetterie* bil;

        map <string,string> affectation; //<nomDiplome,nomTable>
        map <string,int> demandes; //<nomDiplome,etatDemande> etatDemande : 0 si demande impossible, 1 si demande traitée partiellement, 2 si traitée totalement

};

#endif