export interface ResolveConflict {
    id_student: number,
    id_neighbour: number,
    result: 'accepted' | 'refused'
}