-- ================================================================
-- WISHLIST DATABASE SETUP
-- ================================================================
-- This SQL code creates a database table to store wishlist items
-- for users, along with security rules and performance optimizations

-- ================================================================
-- STEP 1: CREATE THE MAIN TABLE
-- ================================================================
-- This creates a new table called "wishlist_items" to store all the wishlist data
CREATE TABLE wishlist_items (

  -- PRIMARY KEY: Unique identifier for each wishlist item
  -- UUID = Universally Unique Identifier (a long random string like "123e4567-e89b-12d3-a456-426614174000")
  -- gen_random_uuid() = automatically generates a new random ID for each item
  -- PRIMARY KEY = this field uniquely identifies each row (no duplicates allowed)
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- FOREIGN KEY: Links this item to the user who created it
  -- UUID = same type as the ID field above
  -- REFERENCES auth.users(id) = this must match an existing user ID in the auth.users table
  -- ON DELETE CASCADE = if a user is deleted, delete all their wishlist items too
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- ITEM NAME: The name/title of the wishlist item
  -- TEXT = can store any text of any length
  -- NOT NULL = this field is required (can't be empty)
  name TEXT NOT NULL,

  -- ITEM DESCRIPTION: Optional longer description of the item
  -- TEXT = can store any text of any length
  -- No "NOT NULL" = this field is optional (can be empty)
  description TEXT,

  -- ITEM LINK: Optional web link to where the item can be found/purchased
  -- TEXT = stores the URL as text
  -- Optional field (can be empty)
  link TEXT,

  -- PRIORITY SCORE: How much the user wants this item (1-10 scale)
  -- INTEGER = whole numbers only (1, 2, 3, etc.)
  -- CHECK (score >= 1 AND score <= 10) = enforces that score must be between 1 and 10
  -- DEFAULT 5 = if no score is provided, automatically set it to 5
  score INTEGER CHECK (score >= 1 AND score <= 10) DEFAULT 5,

  -- PRIVACY SETTING: Whether this item should be hidden from others
  -- BOOLEAN = true/false value only
  -- DEFAULT false = by default, items are public (not private)
  is_private BOOLEAN DEFAULT false,

  -- DIBS TRACKING: Who has "called dibs" on this item (claimed they'll get it)
  -- UUID = references another user's ID
  -- REFERENCES auth.users(id) = must be a valid user ID
  -- ON DELETE SET NULL = if the person who dibbed it is deleted, clear this field
  dibbed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- DIBS TIMESTAMP: When someone called dibs on this item
  -- TIMESTAMP WITH TIME ZONE = stores date and time with timezone info
  -- No default = only gets set when someone actually dibs the item
  dibbed_at TIMESTAMP WITH TIME ZONE,

  -- CREATION TIMESTAMP: When this wishlist item was first created
  -- TIMESTAMP WITH TIME ZONE = stores date and time with timezone info
  -- DEFAULT NOW() = automatically set to current date/time when item is created
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- UPDATE TIMESTAMP: When this wishlist item was last modified
  -- TIMESTAMP WITH TIME ZONE = stores date and time with timezone info
  -- DEFAULT NOW() = automatically set to current date/time when item is created or updated
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- STEP 2: ENABLE SECURITY
-- ================================================================
-- Row Level Security (RLS) = a security feature that controls which rows
-- users can see and modify based on rules we define below
-- Without this, any user could see and modify anyone's data
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- STEP 3: CREATE SECURITY POLICIES
-- ================================================================
-- Policies are rules that determine who can do what with the data

-- POLICY 1: Users can only manage their own wishlist items
-- "Users can manage their own items" = just a human-readable name for this policy
-- ON wishlist_items = this policy applies to the wishlist_items table
-- FOR ALL = this policy applies to all operations (SELECT, INSERT, UPDATE, DELETE)
-- USING (auth.uid() = user_id) = only allow access if the current user's ID matches the user_id field
-- auth.uid() = function that returns the ID of the currently logged-in user
CREATE POLICY "Users can manage their own items" ON wishlist_items
  FOR ALL USING (auth.uid() = user_id);

-- POLICY 2: Temporary demo policy - let everyone see all items
-- This is just for testing/demo purposes and should be removed later
-- FOR SELECT = this policy only applies to reading/viewing data (not creating, updating, or deleting)
-- USING (true) = always allow (true means "yes, always allow this")
CREATE POLICY "Everyone can view all items for demo" ON wishlist_items
  FOR SELECT USING (true);

-- POLICY 3: Temporary demo policy - let anyone dibs any item
-- This is also just for testing/demo purposes and should be removed later
-- FOR UPDATE = this policy only applies to updating existing data
-- USING (true) = always allow anyone to update any item (for demo only!)
CREATE POLICY "Anyone can dibs items for demo" ON wishlist_items
  FOR UPDATE USING (true);

-- ================================================================
-- STEP 4: CREATE INDEXES FOR BETTER PERFORMANCE
-- ================================================================
-- Indexes are like a book's index - they help the database find data faster
-- Without indexes, the database has to scan every row to find what it's looking for
-- With indexes, it can jump directly to the right data

-- INDEX 1: Speed up searches by user
-- idx_wishlist_items_user_id = name of this index
-- ON wishlist_items(user_id) = create index on the user_id column of wishlist_items table
-- This makes queries like "show me all items for user X" much faster
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);

-- INDEX 2: Speed up searches by creation date
-- idx_wishlist_items_created_at = name of this index
-- ON wishlist_items(created_at) = create index on the created_at column
-- This makes queries like "show me the newest items" or "show items from last week" much faster
CREATE INDEX idx_wishlist_items_created_at ON wishlist_items(created_at);

-- ================================================================
-- SUMMARY OF WHAT THIS CODE DOES:
-- ================================================================
-- 1. Creates a table to store wishlist items with all necessary fields
-- 2. Sets up security so users can only see/edit their own items (plus demo policies)
-- 3. Creates indexes to make the database queries run faster
-- 4. Handles edge cases like what happens if users are deleted
-- 5. Provides default values for optional fields
-- 6. Enforces data quality rules (like score must be 1-10)
-- ================================================================