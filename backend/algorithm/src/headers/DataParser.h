#if ! defined ( DataParser_H )
#define DataParser_H

#include <iostream>
#include <string>
#include <fstream>
#include <map>

#include "Student.h"

using namespace std;

class DataParser
{
    friend class Student;

    public:

        DataParser(string jsonFile);
        virtual ~DataParser();
        Student** getStudentList();
        int getNbStudent();

    protected:

        Student** studentList;
        map<int, int> index; // map <id, index>
        int nbStudent;
        int tableCapacityMax;
        int nbTableMax;
};

#endif