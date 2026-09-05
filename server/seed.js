const { sequelize, Restaurant, MenuItem, Waiter, Chef, Bartender } = require('./models');

async function seed() {
  await sequelize.sync();

  const restaurant = await Restaurant.create({
    RestaurantName: 'The Grill House',
    Location: 'Lekki, Lagos',
    ContactNumber: '08011112233'
  });

  await MenuItem.bulkCreate([
    { ItemName: 'Jollof Rice & Chicken', ItemType: 'Food', Price: 6500, AvgWaitingTime: 20, RestaurantID: restaurant.RestaurantID },
    { ItemName: 'Chapman', ItemType: 'Drink', Price: 2500, AvgWaitingTime: 5, RestaurantID: restaurant.RestaurantID },
    { ItemName: 'Grilled Suya Platter', ItemType: 'Food', Price: 7000, AvgWaitingTime: 25, RestaurantID: restaurant.RestaurantID },
    { ItemName: 'Red Wine (Glass)', ItemType: 'Drink', Price: 4000, AvgWaitingTime: 3, RestaurantID: restaurant.RestaurantID }
  ]);

  await Waiter.create({ WaiterName: 'Musa Ibrahim', ContactNumber: '08044445566', RestaurantID: restaurant.RestaurantID });
  await Chef.create({ ChefName: 'Femi Adekunle', Specialty: 'Continental', RestaurantID: restaurant.RestaurantID });
  await Bartender.create({ BartenderName: 'Kelvin Ude', ContactNumber: '08077778899', RestaurantID: restaurant.RestaurantID });

  console.log('Seed data inserted successfully.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
