#if ! defined ( Table_H )
#define Table_H

#include <iostream>
#include <string>
#include <fstream>
#include <map>

using namespace std;

#include "Diplome.h"

class Table
{
    public:
        Table();
        virtual ~Table();
        friend ostream& operator<< (ostream&, const Table&);
        friend class PlanTable;

    protected:

        int remplissage;
        Invite* invites;
};

#endif