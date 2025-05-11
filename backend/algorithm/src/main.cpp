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

    SeatingArrangements* seats = new SeatingArrangements(studentList, dataParser->getNbStudent(), dataParser->getTableCapacityMax(), dataParser->getNbTableMax());
    seats->attributeTableToStudent(true);
    seats->completeExistingTable();

    cout << "Total number of demand : " << seats->nbDemand() << endl;
    cout << "Total number of possible demand : " << seats->nbPossibleDemand() << endl;
    cout << "Total number of satisfied demand : " << seats->nbSatisfiedDemand() << endl;
    cout << "Total number of possible first demand : " << seats->nbStudentWithAtLeastOnePossibleDemand() << endl;
    cout << "Total number of satisfied first demand : " << seats->nbStudentWithAtLeastOneDemandSatisfied() << endl;

    cout << "Absolute score : " << seats->absoluteScore() << endl;

    return 0;
}

