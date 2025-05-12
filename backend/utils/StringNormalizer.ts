export class StringNormalizer {
    private static removeAccents(str: string): string {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    static normalizeString(str: string): string {
        return StringNormalizer
            .removeAccents(str)
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase(); 
    }
}