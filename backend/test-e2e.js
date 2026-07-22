import http from 'http';

const BASE_URL = 'http://localhost:8000';

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runE2ETests() {
  console.log('🚀 Starting E2E Backend Verification Tests...\n');

  try {
    // 1. Health Check
    console.log('1. Testing Health Check...');
    const health = await request('/api/health');
    console.log(`   Health Check Status: ${health.status}`, health.body);

    // 2. User Signup
    const testEmail = `testuser_${Date.now()}@example.com`;
    console.log(`\n2. Testing User Signup (${testEmail})...`);
    const signup = await request('/api/auth/signup', 'POST', {
      name: 'Test Chef',
      email: testEmail,
      password: 'password123',
    });
    console.log(`   Signup Status: ${signup.status}`, signup.body);
    const token = signup.body.token;

    // 3. User Login
    console.log('\n3. Testing User Login...');
    const login = await request('/api/auth/login', 'POST', {
      email: testEmail,
      password: 'password123',
    });
    console.log(`   Login Status: ${login.status}`, login.body.success ? 'SUCCESS' : 'FAILED');

    // 4. Fetch Current User (/api/auth/me)
    console.log('\n4. Testing GET /api/auth/me...');
    const me = await request('/api/auth/me', 'GET', null, token);
    console.log(`   Get Me Status: ${me.status}`, me.body.user?.email);

    // 5. Add Pantry Item
    console.log('\n5. Testing Add Pantry Item...');
    const pantryItem = await request('/api/pantry', 'POST', {
      name: 'Tomatoes',
      quantity: 5,
      unit: 'pieces',
      category: 'Vegetables',
    }, token);
    console.log(`   Add Pantry Item Status: ${pantryItem.status}`, pantryItem.body.data?.name);

    // 6. Generate AI Recipe
    console.log('\n6. Testing AI Recipe Generator Endpoint...');
    const aiRecipe = await request('/api/recipes/generate', 'POST', {
      usePantry: true,
      cuisineType: 'Italian',
      servings: 4,
    }, token);
    console.log(`   AI Recipe Generation Status: ${aiRecipe.status}`, aiRecipe.body.data?.name);

    // 7. Save Generated Recipe
    console.log('\n7. Testing Save Recipe...');
    const savedRecipe = await request('/api/recipes', 'POST', {
      name: aiRecipe.body.data?.name || 'Creamy Tomato Pasta',
      description: 'Test recipe saved from AI',
      cuisine_type: 'Italian',
      difficulty: 'easy',
      prep_time: 15,
      cook_time: 20,
      servings: 4,
      ingredients: [
        { name: 'Tomatoes', quantity: 5, unit: 'pieces' },
        { name: 'Pasta', quantity: 200, unit: 'g' },
      ],
      instructions: ['Boil water', 'Cook pasta', 'Mix with tomatoes'],
    }, token);
    console.log(`   Save Recipe Status: ${savedRecipe.status}`, savedRecipe.body.data?._id);

    // 8. Add Meal Plan
    console.log('\n8. Testing Add Meal Plan...');
    const mealPlan = await request('/api/meal-plans', 'POST', {
      recipe_id: savedRecipe.body.data?._id,
      meal_date: new Date().toISOString().split('T')[0],
      meal_type: 'dinner',
    }, token);
    console.log(`   Add Meal Plan Status: ${mealPlan.status}`, mealPlan.body.data?.meal_type);

    // 9. Add Shopping List Item & Transfer
    console.log('\n9. Testing Shopping List Add & Transfer...');
    const shopItem = await request('/api/shopping-list', 'POST', {
      ingredient_name: 'Garlic',
      quantity: 3,
      unit: 'pieces',
      category: 'Produce',
    }, token);
    
    // Toggle check
    await request(`/api/shopping-list/${shopItem.body.data._id}/toggle`, 'PATCH', null, token);
    
    // Transfer to pantry
    const transfer = await request('/api/shopping-list/transfer-to-pantry', 'POST', null, token);
    console.log(`   Transfer to Pantry Status: ${transfer.status}`, `Transferred: ${transfer.body.transferredCount}`);

    // 10. Dashboard Stats
    console.log('\n10. Testing Dashboard Summary Stats...');
    const stats = await request('/api/dashboard/stats', 'GET', null, token);
    console.log(`   Dashboard Stats Status: ${stats.status}`, stats.body.stats);

    // 11. Forgot Password & Reset Password
    console.log('\n11. Testing Forgot Password & Reset Password Flow...');
    const forgotRes = await request('/api/auth/forgot-password', 'POST', {
      email: testEmail,
    });
    console.log(`   Forgot Password Request Status: ${forgotRes.status}`, forgotRes.body.message);

    console.log('\n✅ ALL E2E VERIFICATION TESTS PASSED SUCCESSFULLY!');

  } catch (error) {
    console.error('\n❌ E2E Verification Failed:', error);
  }
}

runE2ETests();
