export enum Diet {
    NoSpecificDiet = "pas de régime spécifique-",
    NoPork = "sans porc-",
    Vegetarian = "végétarien-",
    GlutenFree = "sans gluten-",
    Unrecognized = "non reconnu-"
}

export namespace Diet {
    const dietMap: Record<string, Diet> = {
        "pas de régime spécifique-": Diet.NoSpecificDiet,
        "sans porc-": Diet.NoPork,
        "végétarien-": Diet.Vegetarian,
        "sans gluten-": Diet.GlutenFree
    };

    export function mapDietaryPreference(diet: string): Diet {
        return dietMap[diet] || Diet.Unrecognized;
    }
}
