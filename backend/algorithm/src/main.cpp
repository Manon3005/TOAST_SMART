#include <iostream>
#include <string>

#include "../headers/DataParser.h"
#include "../headers/SeatingArrangements.h"

using namespace std;

int main(int argc, char* argv[])
{
    if (argc < 2) {
        cout << "Link to the JSON file missing" << endl;
        return 1;
    }
    string jsonFilePath = argv[1];
    cout << "Path : " << jsonFilePath << endl;

    DataParser* dataParser = new DataParser(jsonFilePath);
    Student** studentList = dataParser->getStudentList();

    for (int i = 0 ; i < dataParser->getNbStudent() ; i++) {
        studentList[i]->print();
    }
    SeatingArrangements* seats = new SeatingArrangements(studentList, dataParser->getNbStudent(), dataParser->getTableCapacityMax(), dataParser->getNbTableMax());
    cout << "Before createMatrix()" << endl;
    seats->createMatrix();
    seats->printMatrix();

    cout << "Number of demands : "<< seats->nbDemand() << endl;
    cout << "Number of possible demands : "<< seats->nbPossibleDemand() << endl;
    cout << "Number of satisfied demands : "<< seats->nbSatisfiedDemand() << endl;
    cout << "Absolute score : "<< seats->absoluteScore() << endl;
    
    Table* table = new Table();
    table->addStudent(studentList[0]);
    table->addStudent(studentList[1]);
    table->addStudent(studentList[2]);
    table->print();

    studentList[0]->setTable(table);
    studentList[1]->setTable(table);
    studentList[2]->setTable(table);

    Table* table2 = new Table();
    table2->addStudent(studentList[3]);
    table2->print();
    
    studentList[3]->setTable(table2);
    
    seats->mergeTables(table, table2);
    table->print();
    table2->print();

    //SeatingArrangements* seats = new SeatingArrangements(studentList, dataParser->getNbStudent(), dataParser->getTableCapacityMax(), dataParser->getNbTableMax());
    //seats->createMatrix();
    //seats->printMatrix();
    
    return 0;
}

