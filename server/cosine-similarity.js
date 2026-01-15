// Formula: (A · B) / (||A|| * ||B||)
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  return magA === 0 || magB === 0 ? 0 : dotProduct / (magA * magB);
}

async function testProductRecommendations() {
  const customer = {
    name: "Alex",
    preferences: [9, 7, 3, 6, 8, 7, 5, 9], // [tech, sports, fashion, food, travel, music, books, gaming]
  };

  const products = [
    { name: "Wireless Earbuds", categories: [9, 2, 3, 1, 2, 8, 1, 1] },
    { name: "Fitness Tracker", categories: [8, 9, 2, 1, 3, 1, 0, 0] },
    { name: "Gaming Laptop", categories: [10, 1, 1, 0, 1, 2, 1, 10] },
    { name: "Travel Backpack", categories: [4, 5, 6, 1, 9, 0, 1, 0] },
    { name: "Smartphone", categories: [10, 3, 4, 1, 3, 6, 2, 7] },
    { name: "Blender", categories: [5, 1, 1, 9, 1, 0, 0, 0] },
  ];

  console.log(`Customer: ${customer.name}`);
  console.log(
    `Preferences: [Tech, Sports, Fashion, Food, Travel, Music, Books, Gaming]`
  );
  console.log(`            [${customer.preferences.join(", ")}]\n`);

  // Calculate similarity for each product
  const recommendations = products.map((product) => ({
    ...product,
    match: cosineSimilarity(customer.preferences, product.categories),
  }));

  // Sort by match score (highest first)
  recommendations.sort((a, b) => b.match - a.match);

  // Display results
  console.log("Recommended Products:");
  console.log("-".repeat(50));
  recommendations.forEach((product, i) => {
    console.log(
      `${i + 1}. ${product.name.padEnd(20)} ` +
        `| Match: ${(product.match * 100).toFixed(1)}% ` +
        `| Categories: [${product.categories.join(",")}]`
    );
  });
  console.log("-".repeat(50));
}

testProductRecommendations();
