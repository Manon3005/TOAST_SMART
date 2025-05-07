#pragma once

#include <iostream>
#include <map>
#include <vector>

#include "Table.h"
#include "Student.h"

class SeatingArrangements
{

    public:
        SeatingArrangements(Student** studentList, int nbStudent, int tableCapacityMax, int nbTableMax);
        virtual ~SeatingArrangements();

        void createMatrix();
        void printMatrix();
        void addStudentToTable(Student* student, Table* table);

    protected:

        Student** studentList;
        int nbStudent;
        int tableCapacityMax;
        int nbTableMax;
        int nbUsedTable;
        Table* tableList;
        int** matrix;
        int matrixSize;
        map<Table*, int> index;
};