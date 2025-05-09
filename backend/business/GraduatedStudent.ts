import { Guest } from "./Guest";
import { Diet } from "./Diet";

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
    private neighboursString: string;
    private diet: Diet;

    constructor(
        id: number,
        lastName: string,
        firstName: string,
        email: string,
        neighboursString: string,
        nbGuests: number = 0,
        nbNeighbours: number = 0,
        diet: string = "",
        ticket: string = ""
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

    deleteNeighbour(id: number): void {
        this.neighbours = this.neighbours.filter(neighbour => neighbour.id !== id);
    }

    getNeighbours(): GraduatedStudent[] {
        return this.neighbours;
    }

    isNeighboursAlreadyPresent(potentialNeighbour: GraduatedStudent): boolean {
        return this.neighbours.some(neighbour => neighbour.getId() == potentialNeighbour.getId());
    }
    
    getGuests(): Guest[] {
        return this.guests;
    }

    getNeighboursIds(): number[] {
        return this.neighbours.map(neighbour => neighbour.id);
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