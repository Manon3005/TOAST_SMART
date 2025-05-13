import { Guest } from "./Guest";
import { Diet } from "./Diet";
import { Table } from "./Table";

export class GraduatedStudent {
    private id: number;
    private ticket: string;
    private lastName: string;
    private firstName: string;
    private email: string;
    private nbGuests: number;
    private nbNeighbours: number;
    private guests: Guest[] = [];
    private neighbours: GraduatedStudent[] = [];
    private potentialNeighbours: GraduatedStudent[] = [];
    private neighboursString: string;
    private diet: Diet;
    private doubleEmailCatched: boolean;
    private table!: Table;

    constructor(
        id: number,
        lastName: string,
        firstName: string,
        email: string,
        neighboursString: string,
        nbGuests: number = 0,
        nbNeighbours: number = 0,
        diet: string = "",
        ticket: string = "",
    ) {
        this.id = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.neighboursString = neighboursString;
        this.nbGuests = nbGuests;
        this.nbNeighbours = nbNeighbours;
        this.diet = Diet.mapDietaryPreference(diet);
        this.ticket = ticket;
        this.doubleEmailCatched = false;
    }

    hasAllInformation(): boolean {
        // Check if the adding information of a student has been set
        if(!this.ticket || !this.diet) {
            return false;
        }
        return true;
    }

    isHomonym(firstName: string, lastName: string, mail: string): boolean {
        if(firstName === this.firstName && lastName === this.lastName && mail !== this.email) {
            return true;
        }
        return false;
    }

    setTable(table: Table): void {
        this.table = table;
    }

    setDiet(diet: string): void {
        this.diet = Diet.mapDietaryPreference(diet);;
    }

    setTicket(ticket: string): void {
        this.ticket = ticket;
    }
    
    addGuest(guest: Guest): void {
        this.nbGuests++;
        this.guests.push(guest);
    }

    addNeighbour(student: GraduatedStudent): void {
        this.nbNeighbours++;
        this.neighbours.push(student);
    }

    addPotentialNeighbour(student: GraduatedStudent): void {
        this.potentialNeighbours.push(student);
    }

    removePotentialNeighbour(id: number): void {
        this.potentialNeighbours = this.potentialNeighbours.filter(
            neighbour => neighbour.getId() !== id
        );
    }

    deleteNeighbour(id: number): void {
        this.neighbours = this.neighbours.filter(neighbour => neighbour.id !== id);
    }

    getNeighbours(): GraduatedStudent[] {
        return this.neighbours;
    }

    isNeighboursAlreadyPresent(potentialNeighbour: GraduatedStudent): boolean {
        return this.neighbours.some(neighbour => neighbour.getId() == potentialNeighbour.getId());
    }

    isSameStudent(student: GraduatedStudent): boolean {
        if(this.firstName === student.getFirstName() && this.lastName === student.getLastName()) {
            return true;
        }
        return false;
    }
    
    hasDifferentEmail(email: string): boolean {
        return this.email !== email;
    }

    catchDoubleEmail(): void {
        this.doubleEmailCatched = true;
    }

    catchedDoubleEmail(): boolean {
        return this.doubleEmailCatched;
    }

    getGuests(): Guest[] {
        return this.guests;
    }

    getPotentialNeighbours(): GraduatedStudent[] {
        return this.potentialNeighbours;
    }

    getNeighboursIds(): number[] {
        return this.neighbours.map(neighbour => neighbour.id);
    }

    getTable(): Table {
        return this.table;
    }

    getNeighboursString(): string {
        return this.neighboursString;
    }

    getLastName(): string {
        return this.lastName;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getNbGuests(): number {
        return this.nbGuests;
    }

    getNbNeighbours(): number {
        return this.nbNeighbours;
    }

    getId(): number {
        return this.id;
    }

    getEmail(): string {
        return this.email;
    }

    getDiet(): string {
        return this.diet;
    }

    getTicket(): string {
        return this.ticket;
    }
}