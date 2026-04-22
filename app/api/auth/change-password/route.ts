import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MONGO_URI = process.env.MONGO_URI;

export async function POST(req: NextRequest) {
  try {
    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // 1. Get token from Authorization header
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = decoded.id || decoded.userId || decoded.sub;
    if (!userId) {
       return NextResponse.json({ message: 'User ID not found in token' }, { status: 400 });
    }

    // 3. Connect to MongoDB
    if (!MONGO_URI) {
       return NextResponse.json({ message: 'Database configuration missing' }, { status: 500 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI);
    }

    const db = mongoose.connection.db;
    if (!db) {
       return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
    }

    // 4. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. Update user in the DB
    // We update both 'password' and 'passwordHash' fields to ensure compatibility
    // with the remote backend's login logic.
    const usersCollection = db.collection('users');
    const updateData = { 
        password: hashedPassword, 
        passwordHash: hashedPassword, 
        updatedAt: new Date() 
    };
    
    let result;
    try {
        // Try ObjectId first
        result = await usersCollection.updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            { $set: updateData }
        );
    } catch (e) {
        // If not a valid ObjectId, try as string
        result = await usersCollection.updateOne(
            { _id: userId },
            { $set: updateData }
        );
    }

    if (result.matchedCount === 0) {
      // Last ditch effort: find by email if present in decoded token
      if (decoded.email) {
          result = await usersCollection.updateOne(
              { email: decoded.email },
              { $set: updateData }
          );
      }
    }

    if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Password changed successfully',
      success: true
    });

  } catch (error: any) {
    console.error('Change Password API Error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
