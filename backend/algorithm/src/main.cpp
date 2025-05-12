#include <iostream>
#include <string>
#include <fstream>

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

    DataParser dataParser = DataParser(jsonFilePath);

    Student** studentList = dataParser.getStudentList();

    SeatingArrangements seatingArrangements = SeatingArrangements(studentList, dataParser.getNbStudent(), dataParser.getTableCapacityMax(), dataParser.getNbTableMax());
    //cout << seatingArrangements; // ICI PAS DE NULL POINTER
    seatingArrangements.attributeTableToStudent(true);
    //cout << seatingArrangements; // ICI PAS DE NULL POINTER
    seatingArrangements.completeExistingTable();
    //cout << seatingArrangements; // ICI NON PLUS

    ofstream outputFile;
    string fileName = "../resources/seatingArrangements.csv";
    outputFile.open(fileName);
    cout << seatingArrangements; // ICI OUIIIII
    outputFile << seatingArrangements;
    return 0;
}

