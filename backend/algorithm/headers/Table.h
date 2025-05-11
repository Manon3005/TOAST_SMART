#pragma once

#include <iostream>

#include "Student.h"

class Student;

class Table
{
    public:
        Table();
        virtual ~Table();
        Student* addStudent(Student* student);
        void removeStudent(Student* student);
        void print();

        Student** getStudentList();
        int getNbStudent();
        int getNbFilledSeat();
        int getRemainingStudentPreference();

    protected:
        int nbFilledSeat;
        Student** studentList;
        int nbStudent;
        int remainingStudentPreference;

        void updateNbRemainingStudentPreference();
};