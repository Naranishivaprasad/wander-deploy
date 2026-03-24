require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Package = require('./models/Package');
const Booking = require('./models/Booking');

const packages = [
  {
    title: 'Golden Triangle Tour',
    description: 'Explore the iconic Golden Triangle of India — Delhi, Agra, and Jaipur. Marvel at the Taj Mahal, Amber Fort, and Red Fort. A journey through India\'s royal heritage and Mughal grandeur. Includes guided tours of all major monuments, traditional Rajasthani dinner, and camel safari.',
    price: 15000,
    duration: 7,
    location: 'Delhi, Agra, Jaipur',
    facilities: { hotel: true, food: true, transport: true, guide: true },
    maxGroupSize: 20,
    featured: true,
    image: { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200', publicId: 'sample_gt' },
  },
  {
    title: 'Kerala Backwaters Escape',
    description: 'Drift along the serene backwaters of Alleppey on a traditional houseboat. Enjoy lush paddy fields, coconut groves, and authentic Kerala cuisine on this tranquil southern retreat. Experience Kathakali performances and Ayurvedic spa treatments.',
    price: 12000,
    duration: 5,
    location: 'Kerala',
    facilities: { hotel: true, food: true, transport: true, guide: false },
    maxGroupSize: 15,
    featured: true,
    image: { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200', publicId: 'sample_kl' },
  },
  {
    title: 'Himalayan Adventure Trek',
    description: 'Trek through the breathtaking Himalayan trails of Manali to Rohtang Pass. Experience snow-capped peaks, alpine meadows, and the thrill of high-altitude adventure. Includes camping under the stars, bonfire nights, and river crossing experiences.',
    price: 18000,
    duration: 10,
    location: 'Manali, Himachal Pradesh',
    facilities: { hotel: true, food: true, transport: true, guide: true },
    maxGroupSize: 12,
    featured: true,
    image: { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200', publicId: 'sample_hm' },
  },
  {
    title: 'Goa Beach Paradise',
    description: 'Unwind on Goa\'s pristine beaches with golden sands, azure waters, and vibrant nightlife. Experience the perfect blend of Portuguese heritage and tropical bliss. Explore spice plantations, Old Goa churches, and night markets.',
    price: 9500,
    duration: 4,
    location: 'Goa',
    facilities: { hotel: true, food: false, transport: true, guide: false },
    maxGroupSize: 25,
    featured: false,
    image: { url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200', publicId: 'sample_ga' },
  },
  {
    title: 'Rajasthan Royal Heritage',
    description: 'Step into the land of kings with a royal tour of Rajasthan. Visit majestic forts, opulent palaces, and vibrant bazaars in Udaipur, Jodhpur, and Bikaner. Stay in heritage hotels and witness the spectacular Thar Desert sunset.',
    price: 22000,
    duration: 12,
    location: 'Udaipur, Jodhpur, Bikaner',
    facilities: { hotel: true, food: true, transport: true, guide: true },
    maxGroupSize: 18,
    featured: true,
    image: { url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200', publicId: 'sample_rj' },
  },
  {
    title: 'Andaman Island Retreat',
    description: 'Discover the pristine islands of Andaman with crystal-clear turquoise waters, vibrant coral reefs, and white sandy beaches. Perfect for snorkeling and scuba diving. Visit the historic Cellular Jail and explore Radhanagar Beach.',
    price: 25000,
    duration: 6,
    location: 'Andaman & Nicobar Islands',
    facilities: { hotel: true, food: true, transport: true, guide: false },
    maxGroupSize: 16,
    featured: false,
    image: { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', publicId: 'sample_an' },
  },
  {
    title: 'Varanasi Spiritual Journey',
    description: 'Immerse yourself in the spiritual heart of India — ancient Varanasi on the banks of the holy Ganges. Witness the magnificent Ganga Aarti, take a sunrise boat ride, and explore centuries-old ghats and temples.',
    price: 8500,
    duration: 3,
    location: 'Varanasi, Uttar Pradesh',
    facilities: { hotel: true, food: true, transport: true, guide: true },
    maxGroupSize: 20,
    featured: false,
    image: { url: 'https://images.unsplash.com/photo-1561361058-c24e021e4f59?w=1200', publicId: 'sample_vr' },
  },
  {
    title: 'Leh Ladakh Expedition',
    description: 'Conquer the roof of the world with this epic Ladakh road trip. Drive through the highest motorable passes — Khardung La and Chang La. Visit Pangong Lake, Nubra Valley, and ancient Buddhist monasteries.',
    price: 28000,
    duration: 8,
    location: 'Leh, Ladakh',
    facilities: { hotel: true, food: true, transport: true, guide: true },
    maxGroupSize: 10,
    featured: true,
    image: { url: 'https://images.unsplash.com/photo-1605649461784-56d957e2f66e?w=1200', publicId: 'sample_ll' },
  },
  {
    title: 'Coorg Coffee Trail',
    description: 'Explore the Scotland of India — Coorg\'s misty hills, sprawling coffee and spice plantations, and cascading waterfalls. Visit Abbey Falls, Raja\'s Seat, and experience authentic Kodava cuisine and culture.',
    price: 10000,
    duration: 4,
    location: 'Coorg, Karnataka',
    facilities: { hotel: true, food: true, transport: true, guide: false },
    maxGroupSize: 20,
    featured: false,
    image: { url: 'https://images.unsplash.com/photo-1594392175511-30eca83d51c8?w=1200', publicId: 'sample_cg' },
  },
  {
    title: 'Sundarban Wildlife Safari',
    description: 'Venture into the world\'s largest mangrove forest — the Sundarbans. Track the elusive Royal Bengal Tiger, spot saltwater crocodiles, and cruise through enchanting waterways in this UNESCO World Heritage Site.',
    price: 14000,
    duration: 4,
    location: 'Sundarbans, West Bengal',
    facilities: { hotel: true, food: true, transport: true, guide: true },
    maxGroupSize: 14,
    featured: false,
    image: { url: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=1200', publicId: 'sample_sb' },
  },
];

const seedDB = async () => {
  await connectDB();

  const args = process.argv.slice(2);
  const forceReset = args.includes('--reset');

  // Check if data already exists
  const existingPackages = await Package.countDocuments();
  const existingUsers = await User.countDocuments();

  if (existingPackages > 0 && !forceReset) {
    console.log(`⚠️  Database already has ${existingPackages} packages and ${existingUsers} users.`);
    console.log('   Run with --reset flag to clear and reseed: node seeder.js --reset');
    process.exit(0);
  }

  if (forceReset) {
    await User.deleteMany();
    await Package.deleteMany();
    await Booking.deleteMany();
    console.log('🗑️  Cleared existing data...');
  }

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@travel.com',
    password: 'admin123',
    role: 'admin',
  });

  // Create regular user
  const user = await User.create({
    name: 'John Traveller',
    email: 'user@travel.com',
    password: 'user1234',
    role: 'user',
  });

  // Seed packages
  const seededPackages = await Package.insertMany(
    packages.map((p) => ({ ...p, createdBy: admin._id }))
  );

  // Create sample bookings
  await Booking.create({
    user: user._id,
    package: seededPackages[0]._id,  // Golden Triangle
    travelDate: new Date('2026-04-15'),
    numberOfPeople: 2,
    totalPrice: seededPackages[0].price * 2,
    status: 'confirmed',
  });

  await Booking.create({
    user: user._id,
    package: seededPackages[2]._id,  // Himalayan Trek
    travelDate: new Date('2026-05-10'),
    numberOfPeople: 1,
    totalPrice: seededPackages[2].price,
    status: 'pending',
  });

  console.log('\n✅ Database seeded successfully!');
  console.log(`📦 Created ${seededPackages.length} travel packages`);
  console.log('👤 Admin:  admin@travel.com  / admin123');
  console.log('👤 User:   user@travel.com   / user1234');
  console.log('📅 Created 2 sample bookings\n');
  process.exit(0);
};

seedDB().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
