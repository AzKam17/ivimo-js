import { AppDataSource } from "../src/modules/config";
import { MaterialsCategory } from "../src/modules/materials/infrastructure/entities/materials-category.orm-entity";
import type { Metadata } from "../src/core/types";

async function main() {
  console.log("Starting database feed script...");
  
  // Initialize the database connection
  try {
    await AppDataSource.initialize();
    console.log("Database connection established");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }

  // Sample categories data
  const categories = [
    {
      name: "Outils & Équipements",
      slug: "tools_equipements",
      image: "",
      icon: "lucide lucide-hammer",
      extras: { displayOrder: 1, featured: true } as Metadata
    },
    {
      name: "Maçonnerie",
      slug: "masonry",
      image: "",
      icon: "lucide lucide-brick-wall",
      extras: { displayOrder: 2, featured: true } as Metadata
    },
    {
      name: "Menuiserie & Bois",
      slug: "carpentry_woodworking",
      image: "",
      icon: "lucide lucide-tree-pine",
      extras: { displayOrder: 3, featured: true } as Metadata
    },
    {
      name: "Revêtements & Peinture",
      slug: "coatings_paint",
      image: "",
      icon: "lucide lucide-paint-roller",
      extras: { displayOrder: 4, featured: true } as Metadata
    },
    {
      name: "Isolation & Étanchéité",
      slug: "insulation_waterproofing",
      image: "",
      icon: "lucide lucide-droplet",
      extras: { displayOrder: 5, featured: false } as Metadata
    },
    {
      name: "Matériels de terrassement",
      slug: "earthmoving_equipment",
      image: "",
      icon: "lucide lucide-mountain",
      extras: { displayOrder: 6, featured: false } as Metadata
    },
    {
      name: "Sécurité & Protection",
      slug: "security_protection",
      image: "",
      icon: "lucide lucide-hard-hat",
      extras: { displayOrder: 7, featured: false } as Metadata
    },
    {
      name: "Matériels divers",
      slug: "miscellaneous_equipment",
      image: "",
      icon: "lucide lucide-package",
      extras: { displayOrder: 8, featured: false } as Metadata
    },
    {
      name: "Énergies renouvelables",
      slug: "renewable_energy",
      image: "",
      icon: "lucide lucide-wind",
      extras: { displayOrder: 9, featured: false } as Metadata
    },
    {
      name: "Mesure & Nivellement",
      slug: "measurement_leveling",
      image: "",
      icon: "lucide lucide-ruler",
      extras: { displayOrder: 10, featured: false } as Metadata
    }
  ];

  try {
    console.log("Inserting material categories...");
    
    // Clear existing data (optional - remove if you want to keep existing data)
    await AppDataSource.getRepository(MaterialsCategory).clear();
    
    // Insert categories
    for (const categoryData of categories) {
      const category = MaterialsCategory.create(categoryData);
      await AppDataSource.getRepository(MaterialsCategory).save(category);
      console.log(`Added category: ${category.name}`);
    }
    
    console.log("Successfully inserted all categories!");
  } catch (error) {
    console.error("Error inserting categories:", error);
  } finally {
    // Close the database connection
    await AppDataSource.destroy();
    console.log("Database connection closed");
  }
}

// Run the main function
main().catch(error => {
  console.error("Unhandled error:", error);
  process.exit(1);
});