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

    nbUsedTable = nbStudent;
    tableList = new Table[nbUsedTable];

    for(int i = 0 ; i < nbUsedTable ; i++) {
        index[&(tableList[i])] = i;
    }

    /*
    for (int i = 0 ; i < nbStudent ; i++) {
        moveStudentToTable(studentList[i], &(tableList[i]));
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

void SeatingArrangements::moveStudentToTable(Student* student, Table* table) {
    if (student && table) {
        /*cout << "Moving :" << endl;
        student->print();
        cout << "To :" << endl;
        table->print();*/
        table->addStudent(student);
        Table* previousTable = student->getTable();
        if (previousTable) {
            previousTable->removeStudent(student);
        }
        student->setTable(table);
    } else {
        cout << "Error table or student pointer undefined" << endl;
    }
}


void SeatingArrangements::mergeTables(Table* tableSource, Table* tableDestination) {
    if (tableSource && tableDestination) {
        int nbStudent = tableSource->getNbStudent();
        for (int i = 0 ; i < nbStudent ; i++) {
            Student* student = tableSource->getStudentList()[0];
            moveStudentToTable(student, tableDestination);
        }
    } else {
        cout << "Error table pointer undefined" << endl;
    }
}
        


void SeatingArrangements::attributeTableToStudent() {


}
