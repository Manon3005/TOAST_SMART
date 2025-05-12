#include <iostream>
#include <string>
#include <fstream>
#include <ctime>

#include "../headers/DataParser.h"
#include "../headers/SeatingArrangements.h"

using namespace std;

int main(int argc, char* argv[])
{
    if (argc < 3) {
        cout << "Link to the JSON file or file path of the generated .csv missing" << endl;
        return 1;
    }
    string jsonFilePath = argv[1];
    string outputFilePath = argv[2];
    cout << "JSON Path : " << jsonFilePath << endl;
    cout << "CSV Path : " << outputFilePath << endl;

    DataParser dataParser = DataParser(jsonFilePath);

    Student** studentList = dataParser.getStudentList();

    SeatingArrangements seatingArrangements = SeatingArrangements(studentList, dataParser.getNbStudent(), dataParser.getTableCapacityMax(), dataParser.getNbTableMax());
    seatingArrangements.attributeTableToStudent(true);
    seatingArrangements.completeExistingTable();

    ofstream outputFile;
    outputFile.open(outputFilePath);
    outputFile << seatingArrangements;
    return 0;
}

