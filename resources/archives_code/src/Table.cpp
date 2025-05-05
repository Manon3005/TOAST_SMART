#include <iostream>
#include <string>
#include <map>

#include "../headers/Table.h"

using namespace std;

#define remplissageMax 15

Table::Table()
{
    remplissage = 0;
    invites = new Invite[remplissageMax];
}

Table::~Table()
{
    delete[] invites;
}

ostream& operator<< (ostream& os, const Table& t)
{
    int i;
    for (i=0;i<t.remplissage;i++)
    {
        Invite inv = t.invites[i];
        os << "personne " << i+1 << ';' << inv.prenom << ' ' << inv.nom;
        if (inv.regime != 'N')
        {
            if (inv.regime == 'V')
            {
                os << " (vegetarien)";
            }
            else if (inv.regime == 'P')
            {
                os << " (sans porc)";
            }
            else if (inv.regime == 'G')
            {
                os << " (sans gluten)";
            }
        }
        os << ';' << endl;
    }
    return os;
}

