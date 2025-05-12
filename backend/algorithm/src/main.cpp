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
    seatingArrangements.attributeTableToStudent(true);
    seatingArrangements.completeExistingTable();

    // cout << "Seating arrangements : " << endl;
    // cout << seatingArrangements << endl;

    // 테이블 그룹 출력 (가까이 있어야 할 테이블 리스트)
    cout << "\nClose Table Groups:" << endl;
    seatingArrangements.printTableGroups();

    ofstream outputFile;
    string fileName = "../resources/seatingArrangements.csv";
    outputFile.open(fileName);
    outputFile << seatingArrangements;

    return 0;
}

