#if ! defined ( Student_H )
#define Student_H

#include <iostream>
#include <string>
using namespace std;


class Student
{
    public:

        friend class DataParser;

        Student(int id, string firstName, string lastName, int nbGuest);
        virtual ~Student();

        void addNeighbour(Student* neighbour);
        void print();

    protected:

        int id;
        string firstName;
        string lastName;
        int nbGuest;
        int nbNeighbour;
        Student** neighbours;
};


#endif