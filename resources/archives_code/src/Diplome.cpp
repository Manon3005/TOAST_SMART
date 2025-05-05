using namespace std;
#include <iostream>
#include <string>
#include "../headers/Diplome.h"

Diplome::Diplome(const Diplome& d)
{
    cout << "Appel au constructeur de copie de Diplome" << endl;
}

void Diplome::AjouterVoisin(Diplome* d)
{
    if (d!=this)
    {
        voisins[nbVoisins++] = d;
        nbVoisinsConvives += d->nbConvives;
    }
}

void Diplome::AjouterConvive(Invite& i)
{
    Invite new_i = i;
    convives [nbConvives++] = new_i;
}

bool Diplome::operator==(const Diplome& d) const
{
    return (this->mail == d.mail);
}


ostream& operator <<(ostream& os, const Diplome& d)
{
    os << d.nbVoisinsConvives + d.nbConvives << ';' << d.nom << ';' << d.prenom << ';' << d.nbConvives << ';';
    int i;
    for (i=0;i<d.nbVoisins;i++)
    {
        if (i>0)
        {
            os << ',';
        }
        os << d.voisins[i]->nom << ' ' << d.voisins[i]->prenom << ' ' << d.voisins[i]->nbConvives;
    }
    return os;
}