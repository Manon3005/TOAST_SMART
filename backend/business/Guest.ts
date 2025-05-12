import { Diet } from "./Diet";

export class Guest {
    private id: number;
    private ticket: string;
    private lastName: string;
    private firstName: string;
    private diet: Diet;

    constructor(id: number, ticket: string, lastName: string, firstName: string, diet: string) {
        this.id = id;
        this.ticket = ticket;
        this.lastName = lastName;
        this.firstName = firstName;
        this.diet = Diet.mapDietaryPreference(diet);
    }

    getLastName(): string {
        return this.lastName;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getDiet(): string {
        return this.diet;
    }

    getTicket(): string {
        return this.ticket;
    }
}
