using namespace std;
#include <iostream>
#include <string>

#include "../headers/PlanTable.h"


int main()
{
    string fichierF = "/mnt/c/Users/manon/Programmes/3IF/Gala/2025/fichier_1_famille.csv";
    string fichierV = "/mnt/c/Users/manon/Programmes/3IF/Gala/2025/fichier_2_voisins.csv";
    string fichierP = "/mnt/c/Users/manon/Programmes/3IF/Gala/2025/billetterie_formatee.csv";
    //string fichierF = "export_pr_plan_extrait_famille.csv";
    //string fichierV = "export_pr_plan_extrait_voisins.csv";
    //string fichierP = "billetterie_test.csv";

    Billetterie b1(fichierF,fichierV);

    cout <<  b1.nbDiplomes << endl;

    //b2.Comparaison(b1);

    ofstream file;
    file.open("billetterie_test.csv");
    file << b1;

    //b1.StatistiquesRegime(cout);

    //int nbTablesRangee[] = {8,8,9,9,9,6,6,5,10,10,9,10,10,10,10,10};
    //PlanTable p1(8,15,16,nbTablesRangee,&b1,fichierP);
    //cout << p1.CalculNumeroTable(num) << endl;

    //int nbTablesRangee[] = {3,3};
    //PlanTable p1(8,11,2,nbTablesRangee,&b1,fichierP);

    //cout << p1.CalculNomTable(2) << endl;
    //cout << p1.CalculNomTable(3) << endl;

    
    /*ofstream file;
    file.open("placement_v2.csv");
    file << p1;*/

    //ofstream file_stats;
    //file_stats.open("stats_placement_v2.txt");

    //p1.CalculNombrePersonnesPlacees(file_stats);
    //file_stats.close();

    return 0;
}

