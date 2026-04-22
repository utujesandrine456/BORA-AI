import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function POST() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      return NextResponse.json(
        { message: 'MONGO_URI not configured on server' },
        { status: 500 }
      );
    }

    // Connect to MongoDB if not connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri);
    }

    const db = mongoose.connection.db;
    if (!db) {
       return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 500 }
      );
    }

    // List of collections to clear for a "reset"
    const collectionsToReset = ['jobs', 'profiles', 'screeningresults', 'notifications'];

    for (const collectionName of collectionsToReset) {
      try {
        await db.collection(collectionName).deleteMany({});
        console.log(`Cleared collection: ${collectionName}`);
      } catch (err) {
        console.warn(`Could not clear collection ${collectionName}:`, err);
      }
    }

    return NextResponse.json({
      message: 'Platform data has been successfully reset.',
      success: true
    });
  } catch (error: any) {
    console.error('System Reset API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error during reset', error: error.message },
      { status: 500 }
    );
  }
}
