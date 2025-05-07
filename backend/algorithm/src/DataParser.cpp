#include <iostream>
#include <string>
#include <fstream>
#include <map>

#include "../headers/DataParser.h"
#include "../resource/json.hpp"

using namespace std;
using json = nlohmann::json;

DataParser::DataParser(string jsonFile) {
    ifstream file(jsonFile);
    if (!file.is_open ())
    {
         throw string("Opening file error");
    }
    if (file.fail ())
    {
        throw string("Reading file error");
    }

    json jsonData;
    file >> jsonData;

    nbTableMax = jsonData["nb_max_tables"];
    tableCapacityMax = jsonData["nb_max_by_tables"];

    nbStudent = 0;
    studentList = new Student*[jsonData["graduated_students"].size()];

    for (const auto& jsonStudent : jsonData["graduated_students"]) {
        int id = jsonStudent["idStudent"];
        index[id] = nbStudent;

        Student* student = new Student(id, jsonStudent["firstName"], jsonStudent["lastName"], jsonStudent["nbOfGuests"]);
        studentList[nbStudent++] = student;
    }

    for (const auto& jsonStudent : jsonData["graduated_students"]) {
        int id = jsonStudent["idStudent"];
        Student* student = studentList[index[id]];
        for (const auto& neighbourId : jsonStudent["idNeighbour"]) {
            if (neighbourId != id && index.count(neighbourId) != 0) {
                int neighbour_index = index[neighbourId];
                student->addNeighbour(studentList[neighbour_index]);
            }
        }
    }
}

DataParser::~DataParser() {
    delete[] studentList;
}

Student** DataParser::getStudentList() {
    return studentList;
}

int DataParser::getNbStudent() {
    return nbStudent;
}

int DataParser::getTableCapacityMax() {
    return tableCapacityMax;
}
        
int DataParser::getNbTableMax() {
    return nbTableMax;
}