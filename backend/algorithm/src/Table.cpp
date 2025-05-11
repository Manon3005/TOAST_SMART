#include <iostream>
#include <string>
#include <map>
#include <cstring>

#include "../headers/Table.h"

using namespace std;

Table::Table(string id, int nbMaxStudent) {
    nbFilledSeat = 0;
    nbStudent = 0;
    remainingStudentPreference = 0;

    this->nbMaxStudent = nbMaxStudent;
    this->id = id;
    studentList = new Student*[nbMaxStudent];
}

Table::~Table() {
    delete[] studentList;
}

Student* Table::addStudent(Student* student) {
    if (nbStudent == nbMaxStudent) {
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
    updateNbRemainingStudentPreference();
    return student;
}

void Table::print() {
    cout << "Table " << id << " :" << endl;
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
        if (to_remove < nbStudent - 1) {
            memmove(studentList + to_remove, studentList + to_remove + 1, (nbStudent - to_remove - 1) * sizeof(studentList));
        }
        nbFilledSeat -= student->getNbGuest() + 1;
        nbStudent--;
    } else {
        cout << "Student not in table" << endl;
    }
}

void Table::updateNbRemainingStudentPreference() {
    remainingStudentPreference = 0;
    for (int i = 0 ; i < nbStudent ; i++) {
        Student* student = studentList[i];
        for (int j = 0 ; j < student->getNbNeighbour() ; j++) {
            Student* neighbour = student->getNeighbours()[j];
            if (neighbour->getTable() != this) {
                remainingStudentPreference++;
            }
        }
    }
}

int Table::getRemainingStudentPreference() {
    return remainingStudentPreference;
}