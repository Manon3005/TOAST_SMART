#pragma once

#include <iostream>
#include <map>

#include "Student.h"

using namespace std;

class DataParser
{
    public:

        DataParser(string jsonFile);
        virtual ~DataParser();
        Student** getStudentList();
        int getNbStudent();
        int getTableCapacityMax();
        int getNbTableMax();

    protected:

        Student** studentList;
        map<int, int> index; // map <id, index>
        int nbStudent;
        int tableCapacityMax;
        int nbTableMax;
};

