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
        int nbDemand();
        int nbPossibleDemand();
        int nbSatisfiedDemand();
        int absoluteScore();
        void moveStudentToTable(Student* student, Table* table);
        void mergeTables(Table* tableSource, Table* tableDestination);
        void attributeTableToStudent();
        void removeTable(int to_remove);
        void completeExistingTable();
        void print();
        void clearTable();

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