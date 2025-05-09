#include <iostream>
#include <string>
#include <map>
#include <cstring>

#include "../headers/Table.h"

using namespace std;

Table::Table() {
    nbFilledSeat = 0;
    nbStudent = 0;
    remainingStudentPreference = 0;
    studentList = new Student*[11];
}

Table::~Table() {
    delete[] studentList;
}

Student* Table::addStudent(Student* student) {
    if (nbStudent == 11) {
        return nullptr;
    }
    for (int i = 0 ; i < nbStudent ; i++) {
        if (studentList[i] == student) {
            return nullptr;
        }
    }
    studentList[nbStudent] = student;
    ++nbStudent;
    nbFilledSeat += student->getNbGuest() + 1;
    return student;
}

void Table::print() {
    cout << "Table :" << endl;
    cout << "Filled seat number : " << nbFilledSeat << endl;
    cout << "Students (" << nbStudent << ")" << endl;
    for (int i = 0 ; i < nbStudent ; i++) {
        cout << "   " + studentList[i]->getLastName() + " " + studentList[i]->getFirstName() << endl;
    }
}

Student** Table::getStudentList() {
    return studentList;
}

int Table::getNbStudent() {
    return nbStudent;
}

int Table::getNbFilledSeat() {
    return nbFilledSeat;
}

void Table::removeStudent(Student* student)
{
    int to_remove = -1;
    for (int i = 0 ; i < nbStudent ; i++) {
        if (studentList[i] == student) {
            to_remove = i;
        }
    }
    if (to_remove != -1) {
        memmove(studentList + to_remove, studentList + to_remove + 1, (nbStudent - to_remove - 1) * sizeof(studentList));
        nbFilledSeat -= student->getNbGuest() + 1;
        nbStudent--;
    } else {
        cout << "Student not in table" << endl;
    }
}