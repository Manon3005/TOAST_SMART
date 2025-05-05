using namespace std;
#include <iostream>
#include <string>
#include <fstream>
#include <map>

#include "../headers/Billetterie.h"

#define SEP ';'

Billetterie::Billetterie(string& fichierFamille,string& fichierVoisins)
{
    ifstream file;
    try
    {  
        file.open(fichierFamille);
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

    liste = new Diplome*[N];
    nbDiplomes = 0;
    nbVege = nbRegimeNormal = nbSansPorc = nbSansGluten = nbVegan = 0;
    
    while(!file.eof())
    {
        Invite i;
        string mail;
        string regime;
        string nom;
        string prenom;

        getline(file,i.nom,SEP);
        getline(file,i.prenom,SEP);
        getline(file,nom,SEP);
        getline(file,prenom,SEP);
        getline(file,mail,SEP);
        getline(file,regime);

        i.regime = RegimeAlimentaire(regime);

        if (index.count(nom) == 0)
        {
            Diplome* d = new Diplome(nom,prenom,mail);
            liste[nbDiplomes] = d;
            index[nom] = nbDiplomes;
            nbDiplomes++;
        }
        liste[index[nom]]->AjouterConvive(i);
    }
    this->AjoutVoisins(fichierVoisins);
}

Billetterie::~Billetterie()
{
    delete[] liste;
}

char Billetterie::RegimeAlimentaire(string regime)
{
    if (regime[0] == 'p')
    {
        ++nbRegimeNormal;
        return 'N';
    }
    else if (regime[0] == 'v' && regime[4] == 't')
    {
        ++nbVege;
        return 'V';
    } 
    else if (regime[0] == 'v' && regime[4] == 'n') 
    {
        ++nbVegan;
        return 'N';
    }
    else if (regime[5] == 'g')
    {
        ++nbSansGluten;
        return 'G';
    }
    else if (regime[5] == 'p')
    {
        ++nbSansPorc;
        return 'P';
    }
    else
    {
        cout << regime << endl;
        cout << "Erreur régime" << endl;
        return 'E';
    }
}

ostream& operator<< (ostream& os,const Billetterie& b)
{
    os << "Total" << ';' << "Nom" << ';' << "Prenom" << ';' << "Nombre convives" << ';' << "Voisins" << endl;
    int i;
    for (i=0 ; i<b.nbDiplomes ; i++)
    {
        os << *(b.liste[i]) << endl;
    }
    return os;
}

void Billetterie::ExtraireVoisins(const string& str,Diplome& d)
{
    if (d.nbVoisins==0)
    {
        int i = 0;
        Diplome* voisin;
        string prenom;
        string nom;
        while(i<str.length()) //-1 car caractère chelou à la fin
        {
            nom = "";
            prenom = "";
            while(str[i]!=' ')
            {
                prenom.append(1,str[i++]);
            }
            ++i;
            while(i<str.length() && int(str[i]) != 13 && str[i]!=',')
            {
                nom.append(1,str[i++]);  
            }
            i+=2;

            if (index.count(nom) == 1)
            {
                voisin = liste[index[nom]];
                d.AjouterVoisin(voisin);
            }
            else
            {
                cout << "Erreur diplome voisin : " << prenom << ' ' << nom << " manquant pour " << d.nom << endl;
            }
        }
    }
}

void Billetterie::AjoutVoisins(const string& fichierVoisins)
{
    ifstream file;
    try
    {  
        file.open (fichierVoisins);
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
    string prenom;
    string voisins;
    string useless;
    Diplome* demandeur;

    while(!file.eof())
    {
        getline(file,nom,SEP);
        getline(file,prenom,SEP); //pour gérer cas homonymes peut-être plus tard
        getline(file,voisins,SEP);
        getline(file,useless);
        if (voisins.c_str()[0] != '-')
        {
            if (index.count(nom) == 1)
            {
                demandeur = liste[index[nom]];
                ExtraireVoisins(voisins,*demandeur);
            }
            else
            {
                cout << "Erreur diplome demandeur : " << nom << " manquant" << endl;
            }
        }
    }
}

void Billetterie::RechercheDiplome(ostream& os, string& nom)
{
    if (index.count(nom) == 1)
    {
        int i;
        int j;
        bool res;
        Diplome* diplomeRecherche = liste[index[nom]];
        Diplome* diplome;
        for (i=0 ; i<nbDiplomes ; i++)
        {
            diplome = liste[i];
            res = false;
            j = 0;
            while (j<diplome->nbVoisins && !res)
            {
                if (diplome->voisins[j] == diplomeRecherche)
                {
                    res = true;
                }
                j++;
            }
            if (res)
            {
                os << diplome->nom << ' ' << diplome->prenom << endl;
            }
        }
    }
}

void Billetterie::StatistiquesRegime(ostream& os) const
{
    os << "Nombre vege : " << nbVege << endl;
    os << "Nombre sans porc : " << nbSansPorc << endl;
    os << "Nombre sans gluten : " << nbSansGluten << endl;
    os << "Nombre regimes normaux (hors allergie) : " << nbRegimeNormal << endl;
}

void Billetterie::Comparaison(const Billetterie& b2)
{
    Diplome* d1;
    Diplome* d2;
    int i;
    int j;
    bool res;
    for(i=0;i<this->nbDiplomes;i++)
    {
        res = false;
        d1 = this->liste[i];
        for (j=0;j<b2.nbDiplomes;j++)
        {
            d2 = b2.liste[j];
            if((*d1) == (*d2))
            {
                res = true;
            }
        }
        if (res == false)
        {
            cout << d1->nom << " n'est pas dans l'autre fichier" << endl;
        }
    }
}