interface FamilyRelationship {
  id: string;
  person_id: string;
  related_person_id: string;
  relationship_type: string;
}

/**
 * Validates a relationship between two family members
 * Returns an error message if invalid, null if valid
 */
export const validateRelationship = (
  person1Id: string,
  person2Id: string,
  relationshipType: string,
  existingRelationships: FamilyRelationship[]
): string | null => {
  // Check if same person
  if (person1Id === person2Id) {
    return "Cannot create a relationship with the same person";
  }

  // Check if relationship already exists
  const existingRelation = existingRelationships.find(
    (rel) =>
      (rel.person_id === person1Id && rel.related_person_id === person2Id) ||
      (rel.person_id === person2Id && rel.related_person_id === person1Id)
  );

  if (existingRelation) {
    return `A relationship already exists between these people (${existingRelation.relationship_type})`;
  }

  // Check for circular parent-child relationships
  if (relationshipType === "parent" || relationshipType === "child") {
    const isCircular = checkCircularRelationship(
      person1Id,
      person2Id,
      relationshipType,
      existingRelationships
    );
    if (isCircular) {
      return "This would create a circular family relationship";
    }
  }

  // Check for multiple spouses (optional - can be removed if polygamy is allowed)
  if (relationshipType === "spouse") {
    const person1Spouses = existingRelationships.filter(
      (rel) =>
        rel.relationship_type === "spouse" &&
        (rel.person_id === person1Id || rel.related_person_id === person1Id)
    );
    const person2Spouses = existingRelationships.filter(
      (rel) =>
        rel.relationship_type === "spouse" &&
        (rel.person_id === person2Id || rel.related_person_id === person2Id)
    );

    if (person1Spouses.length > 0 || person2Spouses.length > 0) {
      return "One or both persons already have a spouse";
    }
  }

  return null;
};

/**
 * Checks if adding a parent-child relationship would create a circular reference
 */
const checkCircularRelationship = (
  person1Id: string,
  person2Id: string,
  relationshipType: string,
  existingRelationships: FamilyRelationship[]
): boolean => {
  const visited = new Set<string>();
  
  const isDescendant = (ancestorId: string, descendantId: string): boolean => {
    if (ancestorId === descendantId) return true;
    if (visited.has(descendantId)) return false;
    visited.add(descendantId);

    // Find all children of descendantId
    const children = existingRelationships.filter(
      (rel) =>
        rel.relationship_type === "parent" &&
        rel.person_id === descendantId
    );

    return children.some((child) =>
      isDescendant(ancestorId, child.related_person_id)
    );
  };

  // If making person1 a parent of person2, check if person2 is already an ancestor of person1
  if (relationshipType === "parent") {
    return isDescendant(person2Id, person1Id);
  }

  // If making person1 a child of person2, check if person1 is already an ancestor of person2
  if (relationshipType === "child") {
    return isDescendant(person1Id, person2Id);
  }

  return false;
};

/**
 * Returns the inverse relationship type
 * Example: parent -> child, spouse -> spouse
 */
export const getInverseRelationship = (
  relationshipType: string
): string | null => {
  const inverseMap: Record<string, string> = {
    parent: "child",
    child: "parent",
    spouse: "spouse",
    sibling: "sibling",
    grandparent: "grandchild",
    grandchild: "grandparent",
    aunt_uncle: "niece_nephew",
    niece_nephew: "aunt_uncle",
    cousin: "cousin",
  };

  return inverseMap[relationshipType] || null;
};

/**
 * Suggests compatible relationships based on existing connections
 */
export const suggestRelationships = (
  person1Id: string,
  person2Id: string,
  existingRelationships: FamilyRelationship[]
): string[] => {
  const suggestions: string[] = [];

  // Check if they share a parent (would make them siblings)
  const person1Parents = existingRelationships.filter(
    (rel) =>
      rel.relationship_type === "child" && rel.person_id === person1Id
  );
  const person2Parents = existingRelationships.filter(
    (rel) =>
      rel.relationship_type === "child" && rel.person_id === person2Id
  );

  const sharedParent = person1Parents.find((p1Parent) =>
    person2Parents.some((p2Parent) => p1Parent.related_person_id === p2Parent.related_person_id)
  );

  if (sharedParent) {
    suggestions.push("sibling");
  }

  // Add more suggestion logic here as needed

  return suggestions;
};
