import { currentUser } from '@clerk/nextjs/server';
import connectToDatabase from './db';
import User, { IUser } from '@/models/User'; // This imports the User model we created

/**
 * Fetches the current authenticated user from Clerk and syncs their data
 * with the local MongoDB database. This "upsert" logic ensures our local
 * user record is always up-to-date.
 * @returns Promise<IUser | null> - The user document from the local database, or null if not authenticated.
 */
export async function getCurrentUser(): Promise<IUser | null> {
  try {
    // 1. Get the current user from Clerk's session
    const clerkUser = await currentUser();

    // If there's no user logged in, return null
    if (!clerkUser) {
      return null;
    }

    // 2. Connect to your MongoDB database
    await connectToDatabase();

    // 3. Check if this user already exists in your local database
    const existingUser = await User.findOne({ clerkId: clerkUser.id });

    // 4. If the user already exists, return their local profile
    if (existingUser) {
      return existingUser;
    }

    // 5. If the user is new, create a new entry for them in your database
    const newUser = await User.create({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      // Safely get the user's role from Clerk's metadata, defaulting to 'user'
      role: (clerkUser.publicMetadata?.role as 'admin' | 'user') || 'user',
    });

    return newUser;

  } catch (error) {
    console.error('Error getting or syncing user:', error);
    // Return null to prevent pages from crashing if there's a database or Clerk error
    return null;
  }
}
