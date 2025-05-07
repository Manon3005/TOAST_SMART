#include <iostream>
#include <string>
#include <map>

#include "../headers/SeatingArrangements.h"

using namespace std;

SeatingArrangements::SeatingArrangements(Student** studentList, int nbStudent, int tableCapacityMax, int nbTableMax) {
    this->tableCapacityMax = tableCapacityMax;
    this->nbStudent = nbStudent;
    this->nbTableMax = nbTableMax;
    this->studentList = studentList;
    tableList = new Table[nbTableMax];
}

SeatingArrangements::~SeatingArrangements() {
    delete[] tableList;
}