#include <iostream>
#include <string>
#include <map>
#include <vector>
#include <algorithm>
#include <cstring>

#include "../headers/SeatingArrangements.h"

using namespace std;

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
    if (student && table) {
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
        


void SeatingArrangements::attributeTableToStudent(bool order) {
    bool change = true;
    vector<int> ignored_index;
    int table_to_merge;
    int max_seat_amount;
    int i;
    // gathering of student with seating preferences
    while (change) {
        change = false;
        ignored_index.clear();
        createMatrix();
        
        vector<int> ordered_i;
        if (order) {
            orderTableByIncreasingNbOfDemand(ordered_i);
        } else {
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
}


void SeatingArrangements::completeExistingTable() { 
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
    if (nbUsedTable > nbTableMax) {
        cout << "No result : " << nbUsedTable - nbTableMax << " table(s) missing" << endl;
    }
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

// 테이블 관계 행렬 생성
void SeatingArrangements::createTableRelationshipMatrix() {
    // 기존 행렬 초기화
    if (matrix) {
        for (int i = 0; i < matrixSize; i++) {
            delete[] matrix[i];
        }
        delete[] matrix;
    }

    // 새로운 행렬 생성
    matrix = new int*[nbUsedTable];
    for (int i = 0; i < nbUsedTable; i++) {
        matrix[i] = new int[nbUsedTable];
        for (int j = 0; j < nbUsedTable; j++) {
            matrix[i][j] = 0; // 초기화
        }
    }
    matrixSize = nbUsedTable;

    // 테이블 간 관계 계산
    for (int i = 0; i < nbUsedTable; i++) {
        for (int j = i + 1; j < nbUsedTable; j++) {
            int relationScore = 0;
            
            // 테이블 i의 모든 학생에 대해
            for (int k = 0; k < tableList[i]->getNbStudent(); k++) {
                Student* student = tableList[i]->getStudentList()[k];
                
                // 학생의 모든 이웃에 대해
                for (int l = 0; l < student->getNbNeighbour(); l++) {
                    Student* neighbour = student->getNeighbours()[l];
                    
                    // 이웃이 테이블 j에 있으면 관계 점수 증가
                    if (neighbour->getTable() == tableList[j]) {
                        relationScore++;
                    }
                }
            }
            
            // 관계 점수 저장 (대칭 행렬)
            matrix[i][j] = relationScore;
            matrix[j][i] = relationScore;
        }
    }
}

// 테이블 그룹화 (DFS 사용)
vector<vector<int>> SeatingArrangements::groupCloseTables() {
    createTableRelationshipMatrix(); // 먼저 관계 행렬 생성
    
    vector<vector<int>> groups;
    vector<bool> visited(nbUsedTable, false);
    
    for (int i = 0; i < nbUsedTable; i++) {
        if (!visited[i]) {
            vector<int> group;
            dfsGroupTables(i, visited, group);
            
            if (!group.empty()) {
                groups.push_back(group);
            }
        }
    }
    
    return groups;
}

// DFS로 테이블 그룹화
void SeatingArrangements::dfsGroupTables(int tableIndex, vector<bool>& visited, vector<int>& group) {
    visited[tableIndex] = true;
    group.push_back(tableIndex);
    
    for (int j = 0; j < nbUsedTable; j++) {
        // 방문하지 않은 테이블이고, 관계가 있는 경우
        if (!visited[j] && matrix[tableIndex][j] > 0) {
            dfsGroupTables(j, visited, group);
        }
    }
}

// 테이블 그룹 출력
void SeatingArrangements::printTableGroups() {
    vector<vector<int>> groups = groupCloseTables();
    
    cout << "Close Table Groups:" << endl;
    for (size_t i = 0; i < groups.size(); i++) {
        cout << "Group " << i + 1 << ": ";
        for (size_t j = 0; j < groups[i].size(); j++) {
            int tableIndex = groups[i][j];
            cout << "Table " << tableList[tableIndex]->getId();
            
            // 그룹 내 테이블에 있는 학생들 출력
            cout << " (";
            for (int k = 0; k < tableList[tableIndex]->getNbStudent(); k++) {
                if (k > 0) cout << ", ";
                Student* student = tableList[tableIndex]->getStudentList()[k];
                cout << student->getFirstName() << " " << student->getLastName();
                if (k >= 2) {
                    cout << "...";
                    break;
                }
            }
            cout << ")";
            
            if (j < groups[i].size() - 1) {
                cout << " - ";
            }
        }
        cout << endl;
    }
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