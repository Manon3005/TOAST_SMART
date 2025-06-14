#pragma once

#include <iostream>
#include <map>
#include <vector>
#include <cstdint>

#include "Table.h"
#include "Student.h"
#include "../resource/json.hpp"

using json = nlohmann::json;

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
        void completeExistingTable(json& rapport_json);
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

        void createTableRelationshipMatrix();
        vector<vector<int>> groupCloseTables(int maxGroupSize = 10);
        void printTableGroups();

        void exportTableGroupsToCSV(const string& filename);

    protected:

        void dfsGroupTables(int tableIndex, vector<bool>& visited, vector<int>& group);
        void divideIntoSubgroups(vector<int>& largeGroup, vector<vector<int>>& groups, int maxGroupSize);

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