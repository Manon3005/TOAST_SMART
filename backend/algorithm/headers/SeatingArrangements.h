#pragma once

#include <iostream>
#include <map>
#include <vector>
#include <cstdint>

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
        void moveStudentToTable(Student* student, Table* table);
        void mergeTables(Table* tableSource, Table* tableDestination);
        void attributeTableToStudent(bool orderByIncreasingDemand, bool orderByNbOfGuest, bool orderTableByDecreasingFilledSeat);
        void removeTable(int to_remove);
        void completeExistingTable();
        void print();
        void clearTable();
        void orderTableByIncreasingNbOfDemand(vector<int>& order);
        void orderTableByFewerGuest(vector<int>& order);
        void orderTableByDecreasingFilledSeat(vector<int>& order);
        friend ostream& operator<< (ostream& os, const SeatingArrangements& sA);
        int getNbUsedTable();

        int nbDemand();
        int nbPossibleDemand();
        int nbSatisfiedDemand();
        int absoluteScore();
        int nbStudentWithAtLeastOnePossibleDemand();
        int nbStudentWithAtLeastOneDemandSatisfied();
        float calculateMeanFilledSeat();
        void print_stats();

    protected:

        Student** studentList;
        int nbStudent;
        int tableCapacityMax;
        int nbTableMax;
        int nbUsedTable;
        Table** tableList;
        int** matrix;
        int matrixSize;
        map<Table*, int> index;
};