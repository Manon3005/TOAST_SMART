#pragma once

#include <iostream>
#include <string>

#include "Table.h"

using namespace std;

class Table;

class Student
{
    public:
        Student(int id, string firstName, string lastName, int nbGuest);
        virtual ~Student();

        void addNeighbour(Student* neighbour);
        void print();

        string getFirstName();
        string getLastName();
        int getNbGuest();
        int getNbNeighbour();
        Student** getNeighbours();
        Table* getTable();

        void setTable(Table* table);


    protected:

        int id;
        string firstName;
        string lastName;
        int nbGuest;
        int nbNeighbour;
        Student** neighbours;
        Table* table;
};