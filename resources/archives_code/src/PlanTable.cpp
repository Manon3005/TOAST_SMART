#include <iostream>
#include <string>
#include <map>

#include "../headers/PlanTable.h"

using namespace std;

#define SEP ';'

int PlanTable::CalculNombreTable() const
{
    int i;
    int sum = 0;
    for(i=0 ; i<nbRangees ; i++)
    {
        sum += nbTablesParRangee[i];
    }
    return sum;
}

PlanTable::PlanTable(int min,int max,int rangees,int* tablesRangees,Billetterie* b,string& FichierPlacement)
{
    remplissageMin = min;
    remplissageMax = max;
    nbRangees = rangees;
    nbTablesParRangee = tablesRangees;
    bil = b;
    
    int nbTables = CalculNombreTable();
    tables = new Table[nbTables];

    ifstream file;
    try
    {  
        file.open (FichierPlacement);
        if (!file.is_open ())
        {
            throw string("Erreur d'ouverture du fichier");
        }
        if (file.fail ())
        {
            throw string("Erreur de lecture du fichier");
        }
    }
    catch(string const& chaine)
    {
        cout << chaine << endl;
        exit(1);
    }

    string nom;
    string table;
    string useless;

    while(!file.eof())
    {
        getline(file,useless,SEP);
        getline(file,table,SEP);
        getline(file,nom,SEP);
        getline(file,useless);
        AjouterDiplomeTable(nom,table);
    }
    file.close();
}

PlanTable::~PlanTable()
{
    delete[] tables;
}

int PlanTable::CalculNumeroTable(string& table) const //indice - pas plus de 10 tables par rangée (numérotées de 0 à 9)
{
    int nbTablesAvant = 0;
    int i;
    for (i=0 ; i<int(table[0])-65 ; i++)
    {
        nbTablesAvant += nbTablesParRangee[i];
    }
    int nombre;
    if (table.size()==3)
    {
        nombre = 10;
    }
    else
    {
        nombre = int(table[1])-48;
    }
    return (nbTablesAvant + nombre - 1);
}

string PlanTable::CalculNomTable(int num) const //indice - pas plus de 10 tables par rangée (numérotées de 0 à 9)
{
    string lettre;
    string chiffre;
    int rang = nbTablesParRangee[0];
    int i = 0;
    while(num>rang-1)
    {
        rang += nbTablesParRangee[++i];
    }
    rang -= nbTablesParRangee[i];
    lettre = char(65+i);
    chiffre = to_string(num-rang+1);
    return lettre+chiffre;
}

void PlanTable::AjouterDiplomeTable(string& nom, string& table)
{
    if (affectation.count(nom) == 0)
    {
        Diplome* d = bil->liste[bil->index[nom]];
        affectation[nom] = table;
        int num = CalculNumeroTable(table);
        Table* t = &(tables[num]);
        int i;
        for (i=0;i<d->nbConvives;i++)
        {
            t->invites[t->remplissage++] = d->convives[i];
        }        
    }
    else
    {
        cout << "Le diplome " << nom << " est place à la table " << affectation[nom] << endl;
    }
}

ostream& operator<< (ostream& os, const PlanTable& p)
{
    int nbTables = p.CalculNombreTable();
    int i;
    for (i=0;i<nbTables;i++)
    {
        os << "Table " << p.CalculNomTable(i) << ';' << endl;
        os << p.tables[i] << endl;
    }
    return os;
}

void PlanTable::CalculNombrePersonnesPlacees(ostream& fichier) const
{
    int nb = 0;
    int nbTables = CalculNombreTable();
    Table* curseur;
    int i;
    for (i=0;i<nbTables;i++)
    {
        curseur = &(tables[i]);
        fichier << CalculNomTable(i) << " : " << curseur->remplissage << endl;
        nb += curseur->remplissage;
    }
    fichier << "Nombre de personnes placées : " << nb << endl;
}


//rajouter stats de placement (peut aussi prendre en compte proximité)