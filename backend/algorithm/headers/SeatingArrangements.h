#if ! defined ( SeatingArrangements_H )
#define SeatingArrangements_H

#include <iostream>
#include <string>
#include <map>
#include "Table.h"

class Student;

class SeatingArrangements
{

    public:
        SeatingArrangements(Student** studentList, int nbStudent, int tableCapacityMax, int nbTableMax);
        virtual ~SeatingArrangements();

    protected:

        Student** studentList;
        int nbStudent;
        int tableCapacityMax;
        int nbTableMax;
        Table* tableList;
};

#endif