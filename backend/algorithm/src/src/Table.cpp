#include <iostream>
#include <string>
#include <map>

#include "../headers/Table.h"

using namespace std;

Table::Table() { 
    nbFilledSeat = 0;
    nbStudent = 0;
    Student** studentList = new Student*[11];
}

Table::~Table() {
    delete[] studentList;
}

Student* Table::addStudent(Student* student) {
    for (int i = 0 ; i < nbStudent ; i++) {
        if (studentList[i] == student) {
            return nullptr;
        }
    }
    studentList[nbStudent] = student;
    ++nbStudent;
    return student;
}