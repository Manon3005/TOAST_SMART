#include <iostream>
#include <string>
#include <map>
#include <vector>
#include <algorithm>
#include <cstring>
#include <fstream>

#include "../headers/SeatingArrangements.h"
#include "../resource/json.hpp"

using namespace std;
using json = nlohmann::json;

SeatingArrangements::SeatingArrangements(Student** studentList, int nbStudent, int tableCapacityMax, int nbTableMax) {
    this->tableCapacityMax = tableCapacityMax;
    this->nbStudent = nbStudent;
    this->nbTableMax = nbTableMax;
    this->studentList = studentList;

    matrix = nullptr;

    nbUsedTable = nbStudent;
    tableList = new Table*[nbUsedTable];

    for(int i = 0 ; i < nbUsedTable ; i++) {
        tableList[i] = new Table(to_string(i), tableCapacityMax);
        index[tableList[i]] = i;
    }

    for (int i = 0 ; i < nbUsedTable ; i++) {
        moveStudentToTable(studentList[i], tableList[i]);
    }
}

SeatingArrangements::~SeatingArrangements() {
    for (int i = 0; i < nbUsedTable; ++i) {
        delete tableList[i];
    }
    delete[] tableList;

    if (matrix) {
        for (int i = 0; i < matrixSize; i++) {
            delete[] matrix[i];
        }
        delete[] matrix;
    }    
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
        for (int j = 0 ; j < tableList[i]->getNbStudent(); j++) {
            Student* student = tableList[i]->getStudentList()[j];
            for (int k = 0 ; k < student->getNbNeighbour() ; k++) {
                Student* neighbour = student->getNeighbours()[k];
                if (neighbour->getTable() != tableList[i])
                line[index[neighbour->getTable()]] = tableList[i]->getNbFilledSeat() + neighbour->getTable()->getNbFilledSeat();
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
    cout << endl;
}

void SeatingArrangements::moveStudentToTable(Student* student, Table* table) {
    if (student) {
        if (table) {
            table->addStudent(student);
        }
        Table* previousTable = student->getTable();
        if (previousTable) {
            previousTable->removeStudent(student);
        }
        student->setTable(table);
    } else {
        cout << "Error student pointer undefined" << endl;
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
        


void SeatingArrangements::attributeTableToStudent(bool orderByIncreasingDemand, bool orderByNbOfGuest, bool orderTableByDecreasingFilledSeat) {
    bool change = true;
    vector<int> ignored_index;
    int table_to_merge;
    int max_seat_amount;
    int i;
    vector<int> ordered_i;

    // gathering of student with seating preferences
    while (change) {
        change = false;
        ignored_index.clear();
        createMatrix();
        
        if (orderByIncreasingDemand) {
            orderTableByIncreasingNbOfDemand(ordered_i);
        } else if (orderByNbOfGuest) { 
            orderTableByFewerGuest(ordered_i);
        } else if (orderTableByDecreasingFilledSeat) {
            this->orderTableByDecreasingFilledSeat(ordered_i);
        } else {
            ordered_i.clear();
            for (int j = 0 ; j < matrixSize ; j++) {
                ordered_i.push_back(j);
            }
        }

        for (int k = 0 ; k < ordered_i.size() ; k++) {
            i = ordered_i[k];
            if (find(ignored_index.begin(), ignored_index.end(),i) == ignored_index.end()) {
                table_to_merge = -1;
                max_seat_amount = 0;
                for (int j = 0 ; j < matrixSize ; j++) {
                    if (find(ignored_index.begin(), ignored_index.end(),j) == ignored_index.end()) {
                        if (matrix[i][j] > max_seat_amount && matrix[i][j] <= tableCapacityMax) {
                            table_to_merge = j;
                        }
                    }
                }
                if (table_to_merge != -1) {
                    change = true;
                    mergeTables(tableList[i], tableList[table_to_merge]);
                    ignored_index.push_back(i);
                    ignored_index.push_back(table_to_merge);
                }
            }
        }
    }
}

void SeatingArrangements::removeTable(int to_remove)
{
    if (to_remove > -1 && to_remove < nbUsedTable) {
        Table* table = tableList[to_remove];
        index.erase(table);
        delete table;
        if (to_remove < nbUsedTable - 1) {
            memmove(tableList + to_remove, tableList + to_remove + 1, (nbUsedTable - to_remove - 1) * sizeof(Table*));        
        }
        nbUsedTable--;
    } else {
        cout << "Table not in list" << endl;
    }
}

void SeatingArrangements::clearTable() {
    vector<int> to_remove;
    for (int i = 0 ; i < nbUsedTable ; i++) {
        if (tableList[i]->getNbFilledSeat() == 0) {
            to_remove.push_back(i);
        }
    }
    int j = 0;
    for (int i = 0; i < to_remove.size(); i++) {
        removeTable(to_remove[i]-j++);
    }
    // reset table id
    for(int i = 0 ; i < nbUsedTable ; i++) {
        tableList[i]->setId(to_string(i + 1));
    }

}


void SeatingArrangements::completeExistingTable(json& rapport_json) { 
    bool change = true;
    int i = 0;
    int j;
    int table_to_merge;
    int min_seat_amount; //worst-fit
    while (nbUsedTable > nbTableMax && change) { //on cherche à minimiser le remplissage des tables ici, pas le nombre de tables
        change = false;
        while (i < nbUsedTable && !change) {
            Table* table = tableList[i];
            j = i + 1;
            table_to_merge = -1;
            min_seat_amount = tableCapacityMax;
            for (int j = i + 1 ; j < nbUsedTable ; j++) {
                if (tableList[j]->getNbFilledSeat() != 0 && table->getNbFilledSeat() + tableList[j]->getNbFilledSeat() <= min_seat_amount) {
                    table_to_merge = j;
                    min_seat_amount = table->getNbFilledSeat() + tableList[j]->getNbFilledSeat();
                }
            }
             if (table_to_merge != -1) {
                change = true;
                mergeTables(table, tableList[table_to_merge]);
            }
            i++;
        }
    }
    clearTable();
    rapport_json["nb_table_missing"] = 0;
    rapport_json["nb_student_without_table"] = 0;
    rapport_json["extra_table"] = 0;
    if (nbUsedTable > nbTableMax) {
        change = true;
        i = 0;
        int studentWithoutTable = 0;
        int tableRemoved = 0;
        rapport_json["nb_table_missing"] = nbUsedTable - nbTableMax;
        // cout << nbUsedTable - nbTableMax << " table(s) missing" << endl;
        while (nbUsedTable - tableRemoved > nbTableMax && change) {
            change = false;
            if (tableList[i]->getNbStudent() == 1) {
                moveStudentToTable(tableList[i]->getStudentList()[0], nullptr);
                change = true;
                studentWithoutTable++;
                tableRemoved++;
            }
            i++;
        }
        rapport_json["nb_student_without_table"] = studentWithoutTable;
        // cout << studentWithoutTable << " student(s) without table" << endl;
        if (nbUsedTable - tableRemoved > nbTableMax) {
            rapport_json["extra_table"] = nbUsedTable - tableRemoved - nbTableMax;
            // cout << nbUsedTable - tableRemoved - nbTableMax << " extra table(s) in the proposal" << endl;
        }
    }
    clearTable();
}

void SeatingArrangements::print() {
    for (int i = 0 ; i < nbUsedTable ; i++) {
        tableList[i]->print();
        cout << endl;
    }
    cout << "Table number : " << nbUsedTable << endl;
}

int SeatingArrangements::nbSatisfiedDemand() {
    int cmp = 0;
    for(int i = 0; i < nbStudent; i++){
        for(int j = 0; j < studentList[i]->getNbNeighbour(); j++){
            if(studentList[i]->getTable() == studentList[i]->getNeighbours()[j]->getTable()){
                cmp += 1;
            }
        }
    }
    return cmp;
}

int SeatingArrangements::nbPossibleDemand(){
    int cmp = 0;
    for(int i = 0; i < nbStudent; i++){
        for(int j = 0; j < studentList[i]->getNbNeighbour(); j++){
            if(studentList[i]->getNbGuest() + studentList[j]->getNbGuest() <= tableCapacityMax){
                cmp += 1;
            }
        }
    }
    return cmp;
}

int SeatingArrangements::nbDemand(){
    int cmp = 0;
    for(int i = 0; i < nbStudent; i++){
        cmp += studentList[i]->getNbNeighbour();
    }
    return cmp;
}

int SeatingArrangements::absoluteScore(){
    int score = 0;
    for (int i = 0; i < nbStudent; i++) {
        bool firstSatisfied = false; //Becomes true when a preference is satisfied for a student
        for (int j = 0; j < studentList[i]->getNbNeighbour(); j++) {
            if (studentList[i]->getTable() == studentList[i]->getNeighbours()[j]->getTable()) {
                if (!firstSatisfied) {
                    score += 50;
                    firstSatisfied = true;
                }
                else {
                    score += 5;
                }
            }
        }
        if (!firstSatisfied && studentList[i]->getNbNeighbour() > 0){
            score += -100;
        }
    }
    return score;
}

int SeatingArrangements::nbStudentWithAtLeastOnePossibleDemand() {
    int cmp = 0;
    bool oneDemandPossible;
    int j;
    for (int i = 0; i < nbStudent; i++) {
        j = 0;
        oneDemandPossible = false;
        while (j < studentList[i]->getNbNeighbour() && !oneDemandPossible) {
            if (studentList[i]->getNbGuest() + studentList[j]->getNbGuest() <= tableCapacityMax){
                    oneDemandPossible = true;
            }
            j++;
        }
        if (oneDemandPossible) {
            cmp++;
        }
    }
    return cmp;
}

int SeatingArrangements::nbStudentWithAtLeastOneDemandSatisfied(){
    int cmp = 0;
    bool oneDemandSatisfied;
    int j;
    for (int i = 0; i < nbStudent; i++) {
        oneDemandSatisfied = false;
        j = 0;
        while (j < studentList[i]->getNbNeighbour() && !oneDemandSatisfied) {
            if (studentList[i]->getTable() == studentList[i]->getNeighbours()[j]->getTable()){
                oneDemandSatisfied = true;
            }
            j++;
        }
        if (oneDemandSatisfied) {
            cmp++;
        }
    }
    return cmp;
}

void SeatingArrangements::orderTableByIncreasingNbOfDemand(vector<int>& order) {
    int min = -1;
    int min_value;
    order.clear();
    for (int i = 0 ; i < nbUsedTable ; i++) {
        min_value = INT32_MAX;
        for (int j = 0 ; j < nbUsedTable ; j++) {
            if (find(order.begin(), order.end(), j) == order.end()) {
                if (tableList[j]->getRemainingStudentPreference() < min_value) {
                    min_value = tableList[j]->getRemainingStudentPreference();
                    min = j;
                }
            }
        }
        order.push_back(min);
    }
}

void SeatingArrangements::orderTableByFewerGuest(vector<int>& order) {
    int min = -1;
    int min_value;
    int nbGuest;
    order.clear();
    for (int i = 0 ; i < nbUsedTable ; i++) {
        min_value = INT32_MAX;
        for (int j = 0 ; j < nbUsedTable ; j++) {
            if (find(order.begin(), order.end(), j) == order.end()) {
                nbGuest = 0;
                for (int k = 0 ; k < tableList[j]->getNbStudent() ; k++) {
                    nbGuest += tableList[j]->getStudentList()[k]->getNbGuest();
                }
                if (nbGuest < min_value) {
                    min_value = nbGuest;
                    min = j;
                }
            }
        }
        order.push_back(min);
    }
}

void SeatingArrangements::orderTableByDecreasingFilledSeat(vector<int>& order) {
    int max = -1;
    int max_value;
    order.clear();
    for (int i = 0 ; i < nbUsedTable ; i++) {
        max_value = 0;
        for (int j = 0 ; j < nbUsedTable ; j++) {
            if (find(order.begin(), order.end(), j) == order.end()) {
                if (tableList[j]->getNbFilledSeat() > max_value) {
                    max_value = tableList[j]->getNbFilledSeat();
                    max = j;
                }
            }
        }
        order.push_back(max);
    }
}

// Relationship matrix between tables
// This matrix is used to determine which tables are close to each other based on the students' preferences
void SeatingArrangements::createTableRelationshipMatrix() {
    // reset matrix if it already exists
    if (matrix) {
        for (int i = 0; i < matrixSize; i++) {
            delete[] matrix[i];
        }
        delete[] matrix;
    }

    // make a new matrix
    matrix = new int*[nbUsedTable];
    for (int i = 0; i < nbUsedTable; i++) {
        matrix[i] = new int[nbUsedTable];
        for (int j = 0; j < nbUsedTable; j++) {
            matrix[i][j] = 0;
        }
    }
    matrixSize = nbUsedTable;

    // calculate the relationship score between each pair of tables
    for (int i = 0; i < nbUsedTable; i++) {
        for (int j = i + 1; j < nbUsedTable; j++) {
            int relationScore = 0;
            
            // for every student at table i
            for (int k = 0; k < tableList[i]->getNbStudent(); k++) {
                Student* student = tableList[i]->getStudentList()[k];
                
                // every neighbour of the student
                for (int l = 0; l < student->getNbNeighbour(); l++) {
                    Student* neighbour = student->getNeighbours()[l];
                    
                    // if the neighbour is at table j, increase the relation score
                    if (neighbour->getTable() == tableList[j]) {
                        relationScore++;
                    }
                }
            }
            
            matrix[i][j] = relationScore;
            matrix[j][i] = relationScore;
        }
    }
}

// Group tables that are close to each other
// This function uses DFS to find connected components in the relationship matrix
vector<vector<int>> SeatingArrangements::groupCloseTables(int maxGroupSize) {
    createTableRelationshipMatrix();
    
    vector<vector<int>> groups;
    vector<bool> visited(nbUsedTable, false);
    
    for (int i = 0; i < nbUsedTable; i++) {
        if (!visited[i]) {
            vector<int> group;
            dfsGroupTables(i, visited, group);
            
            // if the group size exceeds the maximum group size, divide it into smaller subgroups
            if (group.size() > maxGroupSize && group.size() > 1) {
                divideIntoSubgroups(group, groups, maxGroupSize);
            } else if (!group.empty()) {
                groups.push_back(group);
            }
        }
    }
    
    return groups;
}

// divide big groups into smaller subgroups
void SeatingArrangements::divideIntoSubgroups(vector<int>& largeGroup, vector<vector<int>>& groups, int maxGroupSize) {
    int currentIndex = 0;
    
    while (currentIndex < largeGroup.size()) {
        vector<int> subgroup;
        for (int i = 0; i < maxGroupSize && currentIndex < largeGroup.size(); i++) {
            subgroup.push_back(largeGroup[currentIndex++]);
        }
        if (!subgroup.empty()) {
            groups.push_back(subgroup);
        }
    }
}

// dfs to find connected components in the table relationship matrix
void SeatingArrangements::dfsGroupTables(int tableIndex, vector<bool>& visited, vector<int>& group) {
    visited[tableIndex] = true;
    group.push_back(tableIndex);
    
    for (int j = 0; j < nbUsedTable; j++) {
        // if the table is not visited and there is a relationship between the tables
        if (!visited[j] && matrix[tableIndex][j] > 0) {
            dfsGroupTables(j, visited, group);
        }
    }
}


// print the groups of close tables
void SeatingArrangements::printTableGroups() {
    // limit the maximum group size to 5
    int maxGroupSize = 5;
    vector<vector<int>> groups = groupCloseTables(maxGroupSize);

    int groupCount = 0;
    
    for (size_t i = 0; i < groups.size(); i++) {
        if (groups[i].size() >= 2) {
            groupCount++;
            cout << "Group " << groupCount << ": ";
            
            for (size_t j = 0; j < groups[i].size(); j++) {
                int tableIndex = groups[i][j];
                cout << "Table " << tableList[tableIndex]->getId();
                
                if (j < groups[i].size() - 1) {
                    cout << " - ";
                }
            }
            cout << endl;
        }
    }
    
    if (groupCount == 0) {
        cout << "No groups with multiple tables found." << endl;
    }
}

// table groups to CSV
void SeatingArrangements::exportTableGroupsToCSV(const string& filename) {
    // maximum group size
    int maxGroupSize = 5;
    vector<vector<int>> groups = groupCloseTables(maxGroupSize);
    
    ofstream outputFile;
    outputFile.open(filename);
    
    if (!outputFile.is_open()) {
        cout << "Error: Could not open file " << filename << endl;
        return;
    }
    
    // CSV header
    outputFile << "Group,Table,StudentID,LastName,FirstName,NumberOfGuests,Neighbors" << endl;
    
    int groupCount = 0;
    
    for (size_t i = 0; i < groups.size(); i++) {
        if (groups[i].size() >= 2) { 
            groupCount++;
            
            for (size_t j = 0; j < groups[i].size(); j++) {
                int tableIndex = groups[i][j];
                Table* table = tableList[tableIndex];
                
                for (int k = 0; k < table->getNbStudent(); k++) {
                    Student* student = table->getStudentList()[k];
                    
                    outputFile << groupCount << ","
                              << table->getId() << ","
                              << "\"" << student->getLastName() << " " << student->getFirstName() << "\"" << ","
                              << student->getLastName() << ","
                              << student->getFirstName() << ","
                              << (student->getNbGuest() + 1) << ",\"";
                    
                    for (int n = 0; n < student->getNbNeighbour(); n++) {
                        if (n > 0) outputFile << ";";
                        outputFile << student->getNeighbours()[n]->getLastName() << " " << student->getNeighbours()[n]->getFirstName();
                    }
                    outputFile << "\"" << endl;
                }
            }
        }
    }
    
    outputFile.close();
    cout << "Table group information exported to " << filename << endl;
}

ostream& operator<< (ostream& os,const SeatingArrangements& sA)
{
    os << "Table" << ';' << "Last Name Buyer" << ';' << "First Name Buyer" << ';' << "Number of Guests (buyer included)" << ';' << "Seating preferences" << endl;
    int i;
    for (i = 0 ; i < sA.nbStudent ; i++) {
        os << *(sA.studentList[i]) << endl;
    }
    return os;
}

void SeatingArrangements::print_stats() {
    cout << "Number of demand: " << nbDemand() << endl;
    cout << "Number of possible demand: " << nbPossibleDemand() << endl;
    cout << "Number of satisfied demand: " << nbSatisfiedDemand() << endl;
    cout << "Number of student with at least one possible demand: " << nbStudentWithAtLeastOnePossibleDemand() << endl;
    cout << "Number of student with at least one demand satisfied: " << nbStudentWithAtLeastOneDemandSatisfied() << endl;
    cout << "Number of table: " << nbUsedTable << endl;
    cout << "Mean number of guest by table: " << calculateMeanFilledSeat() << endl;
}

float SeatingArrangements::calculateMeanFilledSeat() {
    float mean = 0;
    for (int i = 0 ; i < nbUsedTable ; i++) {
        mean += static_cast< float >(tableList[i]->getNbFilledSeat());
    }
    if (nbUsedTable != 0) {
        mean = mean / static_cast< float >(nbUsedTable);
    }
    return mean;
}

int SeatingArrangements::getNbUsedTable() {
    return nbUsedTable;
}