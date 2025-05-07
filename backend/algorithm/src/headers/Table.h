#if ! defined ( Table_H )
#define Table_H

#include <iostream>
#include <string>
#include <fstream>
#include <map>

using namespace std;

class Student;

class Table
{
    public:
        Table();
        virtual ~Table();
        Student* addStudent(Student* student);

    protected:
        int nbFilledSeat;
        Student** studentList;
        int nbStudent;
};

#endif