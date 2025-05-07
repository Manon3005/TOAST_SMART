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

    nbUsedTable = 0;
    tableList = new Table[nbStudent];

    for(int i = 0 ; i < nbStudent ; i++) {
        index[&(tableList[i])] = i;
    }

    /*for (int i = 0 ; i < nbStudent ; i++) {
        addStudentToTable(studentList[i], &(tableList[i]));
        tableList[i].print();
    }*/
}

SeatingArrangements::~SeatingArrangements() {
    delete[] tableList;
}

void SeatingArrangements::createMatrix() {
    if (matrix) {
        for(int i = 0; i < matrixSize; i++)
            delete[] matrix[i];
        delete[] matrix;       
    }

    matrix = new int*[nbUsedTable];
    for (int i = 0; i < nbUsedTable; i++) {
        matrix[i] = new int[nbUsedTable];
        for (int j = 0 ; j < nbUsedTable ; j++) {
            matrix[i][j] = 0;
        }
    }
    matrixSize = nbUsedTable;

    for (int i = 0 ; i < nbUsedTable ; i++) {
        int* line = matrix[i];
        for (int j = 0 ; j < tableList[i].getNbStudent(); j++) {
            Student* student = tableList[i].getStudentList()[j];
            for (int k = 0 ; k < student->getNbNeighbour() ; k++) {
                Student* neighbour = student->getNeighbours()[k];
                line[index[neighbour->getTable()]] = tableList[i].getNbFilledSeat() + neighbour->getNbGuest() + 1;
            }
        }
    }
}

void SeatingArrangements::printMatrix() {
    for (int i = 0; i < matrixSize; i++) {
        for (int j = 0; j < matrixSize; j++ ) {
            cout << matrix[i][j];
            if (matrix[i][j] < 10) {
                cout << " ";
            }
            cout << "  ";
        }
        cout << endl;
    } 
}

void SeatingArrangements::addStudentToTable(Student* student, Table* table) {
    if (table->getNbStudent() == 0) {
        nbUsedTable++;
    }
    table->addStudent(student);
    student->setTable(table);
}

