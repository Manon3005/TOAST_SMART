import { Diet } from "./Diet";

export class Guest {
    private id: number;
    private lastName: string;
    private firstName: string;
    private diet: Diet;

    constructor(id: number, lastName: string, firstName: string, diet: string) {
        this.id = id;
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
}
