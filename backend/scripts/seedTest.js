const db = require('../src/config/db')

function norm(s) {
  return String(s || '').trim().toLowerCase()
}

async function seedTest() {
  const uid = 'uid_test'
  const userRef = db.collection('users').doc(uid)

  const user = {
    userId: uid,
    email: 'test@demo.com',
    displayName: 'Test User',
    householdId: null,
    createdAt: new Date().toISOString()
  }

  await userRef.set(user)

  const pantryItems = [
    { name: 'eggs', quantity: 6, unit: 'pcs', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { name: 'milk', quantity: 1, unit: 'l', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ]

  const pantryRefs = await Promise.all(pantryItems.map(it => userRef.collection('pantryItems').add(it)))

  const recipe = {
    name: 'Simple Omelette',
    description: 'Fast test recipe',
    prepTimeMinutes: 10,
    ingredients: [
      { name: 'eggs', quantity: 2, unit: 'pcs' },
      { name: 'milk', quantity: 100, unit: 'ml' },
      { name: 'cheese', quantity: 50, unit: 'g' }
    ],
    steps: ['Mix ingredients.', 'Cook in pan.', 'Serve.'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const recipeRef = userRef.collection('recipes').doc()
  await recipeRef.set(recipe)

  const pantrySnap = await userRef.collection('pantryItems').get()
  const pantrySet = new Set(pantrySnap.docs.map(d => norm(d.data().name)))

  const missing = recipe.ingredients.filter(ing => !pantrySet.has(norm(ing.name)))

  const groceryAdds = await Promise.all(
    missing.map(ing =>
      userRef.collection('groceryItems').add({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        checked: false,
        source: {
          type: 'recipe',
          recipeId: recipeRef.id,
          recipeName: recipe.name
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    )
  )

  console.log('Seed test completed.')
  console.log(`User: users/${uid}`)
  console.log(`Pantry items created: ${pantryRefs.length}`)
  console.log(`Recipe created: users/${uid}/recipes/${recipeRef.id} (${recipe.name})`)
  console.log(`Missing ingredients: ${missing.map(x => x.name).join(', ') || '(none)'}`)
  console.log(`Grocery items added from missing: ${groceryAdds.length}`)
}

if (require.main === module) {
  seedTest()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Seed test failed:', err)
      process.exit(1)
    })
}

module.exports = { seedTest }
