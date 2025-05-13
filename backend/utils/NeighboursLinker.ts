import { GraduatedStudent } from "../business/GraduatedStudent";
import { StringNormalizer } from "../utils/StringNormalizer";
import { get as levenshtein } from 'fast-levenshtein';

export class NeighboursLinker {
    private static levenshteinThresholdFullName = 2;
    private static levenshteinThresholdLastName = 1;

    static linkNeighboursToGraduatedStudents(allGraduatedStudents : GraduatedStudent[]): GraduatedStudent[] {
        allGraduatedStudents.forEach(student => {
          const neighbourWords = student.getNeighboursString().toLowerCase().split(/[\s,;:.!?]+/);
          const normalizedNeighbourWords = neighbourWords
            .map(word => StringNormalizer.normalizeString(word));
          
          // Case 1 : Matching on fullname with max 2 errors in the combination
          type firstCaseCandidateWithDistance = { candidate: GraduatedStudent; distance: number };
          let firstCaseCandidates: firstCaseCandidateWithDistance[] = [];
          let firstCaseBestDistance = Infinity;
          for (let i = 0; i < normalizedNeighbourWords.length - 1; i++) {
            const combinedNormalizedWords = StringNormalizer.normalizeString(normalizedNeighbourWords[i] + ' ' + normalizedNeighbourWords[i+1]);
            for (const candidate of allGraduatedStudents) {
              const firstNameLastName = StringNormalizer.normalizeString(candidate.getFirstName() + ' ' + candidate.getLastName());
              const lastNameFirstName = StringNormalizer.normalizeString(candidate.getLastName() + ' ' + candidate.getFirstName());
              const distance1 = levenshtein(firstNameLastName, combinedNormalizedWords);
              const distance2 = levenshtein(lastNameFirstName, combinedNormalizedWords);
              const currentDistance = Math.min(distance1, distance2);
              if (currentDistance <= this.levenshteinThresholdFullName && currentDistance <= firstCaseBestDistance) {
                firstCaseBestDistance = currentDistance;
                firstCaseCandidates.push({ candidate, distance: currentDistance });
              }
              for (const guest of candidate.getGuests()) {
                const firstNameLastName = StringNormalizer.normalizeString(guest.getFirstName() + ' ' + guest.getLastName());
                const lastNameFirstName = StringNormalizer.normalizeString(guest.getLastName() + ' ' + guest.getFirstName());
                const distance1 = levenshtein(firstNameLastName, combinedNormalizedWords);
                const distance2 = levenshtein(lastNameFirstName, combinedNormalizedWords);
                const currentDistance = Math.min(distance1, distance2);
                if (currentDistance <= this.levenshteinThresholdFullName && currentDistance <= firstCaseBestDistance) {
                  firstCaseBestDistance = currentDistance;
                  firstCaseCandidates.push({ candidate, distance: currentDistance });
                }
              }
            }
          }
          for (const { candidate, distance } of firstCaseCandidates) {
            if (distance === 0) {
              student.addNeighbour(candidate);
            } else if (distance === firstCaseBestDistance && !student.isNeighboursAlreadyPresent(candidate) && !student.isSameStudent(candidate)) {
              student.addPotentialNeighbour(candidate);
            }
          }
    
          // Case 2 : Matching on name with max 1 error
          type secondCaseCandidateWithDistance = { candidate: GraduatedStudent; distance: number };
          let secondCaseCandidates: secondCaseCandidateWithDistance[] = [];
          let secondCaseBestDistance = Infinity;
          for (let i = 0; i < normalizedNeighbourWords.length; i++) {
            for (const candidate of allGraduatedStudents) {
              const lastName = StringNormalizer.normalizeString(candidate.getLastName());
              const distance = levenshtein(lastName, normalizedNeighbourWords[i]);
              if (distance <= this.levenshteinThresholdLastName && distance <= secondCaseBestDistance) {
                secondCaseBestDistance = distance;
                secondCaseCandidates.push({ candidate, distance: distance });
              }
              for (const guest of candidate.getGuests()) {
                const lastName = StringNormalizer.normalizeString(guest.getLastName());
                const distance = levenshtein(lastName, normalizedNeighbourWords[i]);
                if (distance <= this.levenshteinThresholdLastName && distance <= secondCaseBestDistance) {
                  secondCaseBestDistance = distance;
                  secondCaseCandidates.push({ candidate, distance: distance });
                }
              }
            }
          }
          for (const { candidate, distance } of secondCaseCandidates) {
            if (distance === secondCaseBestDistance && !student.isNeighboursAlreadyPresent(candidate) && !student.isSameStudent(candidate)) {
              student.addPotentialNeighbour(candidate);
            }
          }
        });
        return allGraduatedStudents;
    }
}