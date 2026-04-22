const mongoose = require('mongoose');
async function run() {
  await mongoose.connect('mongodb+srv://delice:delice12345@cluster0.pvaoh1m.mongodb.net');
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));
  
  const targetColl = collections.find(c => c.name.toLowerCase().includes('user') || c.name.toLowerCase().includes('admin'))?.name || 'users';
  console.log('Using collection:', targetColl);
  const sample = await db.collection(targetColl).findOne({});
  if (sample) {
    console.log('Sample User Keys:', Object.keys(sample));
    console.log('Sample User Password Length:', sample.password?.length);
    console.log('Sample User Password Start:', sample.password?.substring(0, 10));
  }
  process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });
