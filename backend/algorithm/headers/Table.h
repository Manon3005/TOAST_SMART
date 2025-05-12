#pragma once

#include <iostream>
#include <string>

#include "Student.h"

using namespace std;

class Student;

class Table
{
    public:
        Table(string id, int nbMaxStudent);
        virtual ~Table();
        Student* addStudent(Student* student);
        void removeStudent(Student* student);
        void print();

        Student** getStudentList();
        int getNbStudent();
        int getNbFilledSeat();
        int getRemainingStudentPreference();
        string getId();

    protected:
        string id;
        int nbFilledSeat;
        Student** studentList;
        int nbStudent;
        int nbMaxStudent;
        int remainingStudentPreference;

        void updateNbRemainingStudentPreference();
};