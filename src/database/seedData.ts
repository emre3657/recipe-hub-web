import type { Recipe } from "../types/recipe";
import type { Rating } from "../types/rating";
import type { User } from "../types/user";
export const seedRecipes: Recipe[] = [
  {
    id: "creamy-carbonara",
    title: "Creamy Carbonara",
    description: "Silky pasta with parmesan, egg yolk, and black pepper.",
    category: "Main course",
    durationMinutes: 30,
    ingredients: ["pasta", "egg yolk", "parmesan", "black pepper"],
    instructions: [
      "Boil the pasta.",
      "Whisk the sauce ingredients.",
      "Combine and serve.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=900&q=80",
    authorId: "user-ayse",
    createdAt: new Date("2026-01-10T10:00:00"),
    updatedAt: new Date("2026-01-10T10:00:00"),
  },
  {
    id: "chicken-curry",
    title: "Chicken Curry",
    description: "Comforting curry with fragrant spices and tender chicken.",
    category: "Main course",
    durationMinutes: 45,
    ingredients: ["chicken", "onion", "garlic", "curry powder", "coconut milk"],
    instructions: [
      "Brown the chicken.",
      "Cook the aromatics.",
      "Simmer until tender.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80",
    authorId: "user-mehmet",
    createdAt: new Date("2026-01-12T11:30:00"),
    updatedAt: new Date("2026-01-12T11:30:00"),
  },
  {
    id: "greek-salad",
    title: "Greek Salad",
    description: "Fresh salad with cucumber, tomato, olives, and feta.",
    category: "Salad",
    durationMinutes: 15,
    ingredients: ["cucumber", "tomato", "olives", "feta", "olive oil"],
    instructions: [
      "Chop the vegetables.",
      "Toss with dressing.",
      "Top with feta.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80",
    authorId: "user-zeynep",
    createdAt: new Date("2026-01-14T08:45:00"),
    updatedAt: new Date("2026-01-14T08:45:00"),
  },
  {
    id: "chocolate-brownies",
    title: "Chocolate Brownies",
    description: "Rich fudgy brownies with a crackly top.",
    category: "Dessert",
    durationMinutes: 40,
    ingredients: ["chocolate", "butter", "eggs", "sugar", "flour"],
    instructions: [
      "Melt chocolate and butter.",
      "Whisk with eggs and sugar.",
      "Bake until set.",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80",
    authorId: "user-ayse",
    createdAt: new Date("2026-01-16T14:15:00"),
    updatedAt: new Date("2026-01-16T14:15:00"),
  },
];

export const seedUsers: User[] = [
  {
    id: "user-ayse",
    name: "Ayşe Yılmaz",
    createdAt: new Date("2026-01-01T09:00:00"),
  },
  {
    id: "user-mehmet",
    name: "Mehmet Kaya",
    createdAt: new Date("2026-01-01T09:00:00"),
  },
  {
    id: "user-zeynep",
    name: "Zeynep Demir",
    createdAt: new Date("2026-01-01T09:00:00"),
  },
];

export const seedRatings: Rating[] = [
  {
    id: "rating-creamy-carbonara-ayse",
    recipeId: "creamy-carbonara",
    userId: "user-ayse",
    value: 4,
    createdAt: new Date("2026-01-10T12:00:00"),
    updatedAt: new Date("2026-01-10T12:00:00"),
  },
  {
    id: "rating-creamy-carbonara-mehmet",
    recipeId: "creamy-carbonara",
    userId: "user-mehmet",
    value: 5,
    createdAt: new Date("2026-01-11T09:30:00"),
    updatedAt: new Date("2026-01-11T09:30:00"),
  },
  {
    id: "rating-chicken-curry-ayse",
    recipeId: "chicken-curry",
    userId: "user-ayse",
    value: 4,
    createdAt: new Date("2026-01-12T13:00:00"),
    updatedAt: new Date("2026-01-12T13:00:00"),
  },
  {
    id: "rating-chicken-curry-zeynep",
    recipeId: "chicken-curry",
    userId: "user-zeynep",
    value: 5,
    createdAt: new Date("2026-01-13T10:00:00"),
    updatedAt: new Date("2026-01-13T10:00:00"),
  },
  {
    id: "rating-greek-salad-mehmet",
    recipeId: "greek-salad",
    userId: "user-mehmet",
    value: 4,
    createdAt: new Date("2026-01-15T08:20:00"),
    updatedAt: new Date("2026-01-15T08:20:00"),
  },
  {
    id: "rating-chocolate-brownies-ayse",
    recipeId: "chocolate-brownies",
    userId: "user-ayse",
    value: 5,
    createdAt: new Date("2026-01-16T16:00:00"),
    updatedAt: new Date("2026-01-16T16:00:00"),
  },
  {
    id: "rating-chocolate-brownies-zeynep",
    recipeId: "chocolate-brownies",
    userId: "user-zeynep",
    value: 5,
    createdAt: new Date("2026-01-17T09:00:00"),
    updatedAt: new Date("2026-01-17T09:00:00"),
  },
];
