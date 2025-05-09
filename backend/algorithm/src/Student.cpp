using namespace std;
#include <iostream>
#include <string>
#include "../headers/Student.h"

Student::Student(int id, string firstName, string lastName, int nbGuest) { 
    this->id = id;
    this->firstName = firstName;
    this->lastName = lastName;
    this->nbGuest = nbGuest;
    nbNeighbour = 0;
    neighbours = new Student*[15];
    table = nullptr;
}

Student::~Student() {
    delete[] neighbours;
}

void Student::print() {
    cout << "Student : " << firstName << " " << lastName << endl;
    cout << "Guest number : " << nbGuest << endl;
    cout << "Neighbours (" << nbNeighbour << ")" << endl;
    for (int i = 0 ; i < nbNeighbour ; i++) {
        cout << "   " + neighbours[i]->lastName + " " + neighbours[i]->firstName << endl;
    }
}

void Student::addNeighbour(Student* neighbour) {
    if (neighbour->id != id) {
        neighbours[nbNeighbour] = neighbour;
        nbNeighbour++;
    }
}

string Student::getFirstName() {
    return firstName;
}

string Student::getLastName() {
    return lastName;
}

int Student::getNbGuest() {
    return nbGuest;
}

int Student::getNbNeighbour(){
    return nbNeighbour;
}

Student** Student::getNeighbours() {
    return neighbours;
}

void Student::setTable(Table* table) {
    this->table = table;
}

Table* Student::getTable() {
    return table;
}