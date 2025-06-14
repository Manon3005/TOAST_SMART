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
    string option = dataParser.getOption();

    string groupsFileName = outputFilePath.substr(0, outputFilePath.length() - 4) + "_table_group.csv";

    ofstream outputFile;
    outputFile.open(outputFilePath);

    json rapport_json;

    string outputFileJson = outputFilePath.substr(0, outputFilePath.length() - 4) + "_rapport_json.json";
    ofstream outputJson;
    outputJson.open(outputFileJson);
    cout << outputFileJson << endl;

    SeatingArrangements sA = SeatingArrangements(dataParser.getStudentList(), dataParser.getNbStudent(), dataParser.getTableCapacityMax(), dataParser.getNbTableMax());
    if (option == "min_table" || option == "max_demand") {
        SeatingArrangements sA1 = SeatingArrangements(dataParser.getStudentList(), dataParser.getNbStudent(), dataParser.getTableCapacityMax(), dataParser.getNbTableMax());
        sA1.attributeTableToStudent(true, false, false);
        sA1.completeExistingTable(rapport_json);
        int nbTable1 = sA1.getNbUsedTable();
        int nbDemand1 = sA1.nbSatisfiedDemand();

        
        SeatingArrangements sA2 = SeatingArrangements(dataParser.getStudentList(), dataParser.getNbStudent(), dataParser.getTableCapacityMax(), dataParser.getNbTableMax());
        sA2.attributeTableToStudent(false, true, false);
        sA2.completeExistingTable(rapport_json);
        int nbTable2 = sA2.getNbUsedTable();
        int nbDemand2 = sA2.nbSatisfiedDemand();

        SeatingArrangements sA3 = SeatingArrangements(dataParser.getStudentList(), dataParser.getNbStudent(), dataParser.getTableCapacityMax(), dataParser.getNbTableMax());
        sA3.attributeTableToStudent(false, false, true);
        sA3.completeExistingTable(rapport_json);
        int nbTable3 = sA3.getNbUsedTable();
        int nbDemand3 = sA3.nbSatisfiedDemand();

        SeatingArrangements sA4 = SeatingArrangements(dataParser.getStudentList(), dataParser.getNbStudent(), dataParser.getTableCapacityMax(), dataParser.getNbTableMax());
        sA4.attributeTableToStudent(false, false, false);
        sA4.completeExistingTable(rapport_json);
        int nbTable4 = sA4.getNbUsedTable();
        int nbDemand4 = sA4.nbSatisfiedDemand();
        
        SeatingArrangements sAfinal = SeatingArrangements(dataParser.getStudentList(), dataParser.getNbStudent(), dataParser.getTableCapacityMax(), dataParser.getNbTableMax());
        if (option == "min_table") {
            if (nbTable1 <= nbTable2 && nbTable1 <= nbTable3 && nbTable1 <= nbTable4) {
                sAfinal.attributeTableToStudent(true, false, false);
                sAfinal.completeExistingTable(rapport_json);    
            } else if (nbTable2 <= nbTable3 && nbTable2 <= nbTable4) {
                sAfinal.attributeTableToStudent(false, true, false);
                sAfinal.completeExistingTable(rapport_json);  
            } else if (nbTable3 <= nbTable4) {
                sAfinal.attributeTableToStudent(false, false, true);
                sAfinal.completeExistingTable(rapport_json);  
            } else {
                sAfinal.attributeTableToStudent(false, false, false);
                sAfinal.completeExistingTable(rapport_json);  
            }
        } else {
            if (nbDemand1 >= nbDemand2 && nbDemand1 >= nbDemand3 && nbDemand1 >= nbDemand4) {
                sAfinal.attributeTableToStudent(true, false, false);
                sAfinal.completeExistingTable(rapport_json);    
            } else if (nbDemand2 >= nbDemand3 && nbDemand2 >= nbDemand4) {
                sAfinal.attributeTableToStudent(false, true, false);
                sAfinal.completeExistingTable(rapport_json);  
            } else if (nbDemand3 >= nbDemand4) {
                sAfinal.attributeTableToStudent(false, false, true);
                sAfinal.completeExistingTable(rapport_json);  
            } else {
                sAfinal.attributeTableToStudent(false, false, false);
                sAfinal.completeExistingTable(rapport_json);  
            }
        }
        sAfinal.exportTableGroupsToCSV(groupsFileName);
        outputFile << sAfinal;
        outputJson << rapport_json;
    } else if (option == "max_student") {
        sA.attributeTableToStudent(true, false, false);
        sA.completeExistingTable(rapport_json);
        sA.exportTableGroupsToCSV(groupsFileName);
        outputFile << sA;
        outputJson << rapport_json;
    } else if (option == "less_guest") {
        sA.attributeTableToStudent(false, true, false);
        sA.completeExistingTable(rapport_json);
        sA.exportTableGroupsToCSV(groupsFileName);
        outputFile << sA;
        outputJson << rapport_json;
    } else {
        return 1;
    }
    return 0;
}

