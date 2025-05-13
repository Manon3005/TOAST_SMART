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
    
    ofstream outputFile;
    string fileName = "../resources/seatingArrangements.csv";
    outputFile.open(fileName);
    outputFile << seatingArrangements;

    // table groups to CSV
    string groupsFileName = "../resources/tableGroups.csv";
    seatingArrangements.exportTableGroupsToCSV(groupsFileName);

    return 0;
}

