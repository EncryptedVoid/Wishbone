// Mock data for wishlist development and testing

/**
 * Sample wish items with realistic data
 */
export const mockWishItems = [
  {
    id: 'wish-001',
    name: 'MacBook Pro 16" M3',
    link: 'https://apple.com/macbook-pro',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    desireScore: 9,
    categoryTags: ['Electronics', 'Laptop', 'Work'],
    isPrivate: false,
    isDibbed: false,
    description: 'Need this for video editing and development work. The M3 chip would really speed up my workflow.',
    dateAdded: new Date('2024-01-15'),
    collectionId: 'tech'
  },
  {
    id: 'wish-002',
    name: 'Sony WH-1000XM5 Headphones',
    link: 'https://sony.com/headphones',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
    desireScore: 7,
    categoryTags: ['Electronics', 'Audio', 'Travel'],
    isPrivate: false,
    isDibbed: true,
    dibbedBy: 'Sarah',
    description: 'Perfect for my daily commute and work-from-home setup. The noise cancellation would be amazing.',
    dateAdded: new Date('2024-01-20'),
    collectionId: 'tech'
  },
  {
    id: 'wish-003',
    name: 'The Design of Everyday Things',
    link: 'https://amazon.com/design-everyday-things',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
    desireScore: 6,
    categoryTags: ['Books', 'Design', 'Learning'],
    isPrivate: false,
    isDibbed: false,
    description: 'Classic design book that everyone recommends. Want to improve my UX design skills.',
    dateAdded: new Date('2024-01-25'),
    collectionId: 'books'
  },
  {
    id: 'wish-004',
    name: 'Levi\'s 501 Original Jeans',
    link: 'https://levis.com/501-original',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
    desireScore: 5,
    categoryTags: ['Fashion', 'Clothing', 'Casual'],
    isPrivate: false,
    isDibbed: false,
    description: 'Need a good pair of classic jeans. The 501s are timeless and would go with everything.',
    dateAdded: new Date('2024-01-30'),
    collectionId: 'fashion'
  },
  {
    id: 'wish-005',
    name: 'Nintendo Switch OLED',
    link: 'https://nintendo.com/switch-oled',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
    desireScore: 8,
    categoryTags: ['Gaming', 'Electronics', 'Entertainment'],
    isPrivate: false,
    isDibbed: false,
    description: 'Want to play the new Zelda games and have something portable for travel.',
    dateAdded: new Date('2024-02-01'),
    collectionId: 'gaming'
  },
  {
    id: 'wish-006',
    name: 'Instant Pot Duo 7-in-1',
    link: 'https://instantpot.com/duo',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    desireScore: 6,
    categoryTags: ['Kitchen', 'Cooking', 'Appliances'],
    isPrivate: false,
    isDibbed: true,
    dibbedBy: 'Mom',
    description: 'Would make meal prep so much easier. Everyone says it\'s a game changer for busy schedules.',
    dateAdded: new Date('2024-02-05'),
    collectionId: 'home'
  },
  {
    id: 'wish-007',
    name: 'Patagonia Torrentshell Jacket',
    link: 'https://patagonia.com/torrentshell',
    imageUrl: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop',
    desireScore: 7,
    categoryTags: ['Outdoor', 'Clothing', 'Weather'],
    isPrivate: false,
    isDibbed: false,
    description: 'Need a good rain jacket for hiking and everyday wear. Patagonia quality is worth the investment.',
    dateAdded: new Date('2024-02-10'),
    collectionId: 'outdoor'
  },
  {
    id: 'wish-008',
    name: 'Moleskine Notebook Set',
    link: 'https://moleskine.com/notebook-set',
    imageUrl: 'https://images.unsplash.com/photo-1517971129774-39b2c5d0e45f?w=400&h=300&fit=crop',
    desireScore: 4,
    categoryTags: ['Stationery', 'Writing', 'Organization'],
    isPrivate: true,
    isDibbed: false,
    description: 'Love writing by hand for brainstorming. These notebooks have the perfect paper quality.',
    dateAdded: new Date('2024-02-12'),
    collectionId: 'office'
  },
  {
    id: 'wish-009',
    name: 'Dyson V15 Detect Vacuum',
    link: 'https://dyson.com/v15-detect',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    desireScore: 8,
    categoryTags: ['Home', 'Cleaning', 'Appliances'],
    isPrivate: false,
    isDibbed: false,
    description: 'Current vacuum is dying. This one has amazing reviews and the laser dust detection looks cool.',
    dateAdded: new Date('2024-02-15'),
    collectionId: 'home'
  },
  {
    id: 'wish-010',
    name: 'Apple Watch Series 9',
    link: 'https://apple.com/apple-watch',
    imageUrl: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=300&fit=crop',
    desireScore: 6,
    categoryTags: ['Electronics', 'Fitness', 'Smart Watch'],
    isPrivate: false,
    isDibbed: true,
    dibbedBy: 'Alex',
    description: 'Want to track my workouts better and love the integration with my iPhone.',
    dateAdded: new Date('2024-02-18'),
    collectionId: 'tech'
  },
  {
    id: 'wish-011',
    name: 'Allbirds Tree Runners',
    link: 'https://allbirds.com/tree-runners',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    desireScore: 5,
    categoryTags: ['Fashion', 'Shoes', 'Sustainable'],
    isPrivate: false,
    isDibbed: false,
    description: 'Heard these are incredibly comfortable and eco-friendly. Perfect for everyday wear.',
    dateAdded: new Date('2024-02-20'),
    collectionId: 'fashion'
  },
  {
    id: 'wish-012',
    name: 'Kindle Paperwhite',
    link: 'https://amazon.com/kindle-paperwhite',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    desireScore: 7,
    categoryTags: ['Electronics', 'Reading', 'E-reader'],
    isPrivate: false,
    isDibbed: false,
    description: 'Want to read more and this would be perfect for travel. The backlight for night reading is appealing.',
    dateAdded: new Date('2024-02-22'),
    collectionId: 'books'
  },
  {
    id: 'wish-013',
    name: 'Hydroflask Water Bottle',
    link: 'https://hydroflask.com/water-bottle',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
    desireScore: 4,
    categoryTags: ['Outdoor', 'Health', 'Hydration'],
    isPrivate: false,
    isDibbed: false,
    description: 'Need to drink more water and this keeps drinks cold all day. Love the colors available.',
    dateAdded: new Date('2024-02-25'),
    collectionId: 'outdoor'
  },
  {
    id: 'wish-014',
    name: 'Herman Miller Aeron Chair',
    link: 'https://hermanmiller.com/aeron',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    desireScore: 9,
    categoryTags: ['Office', 'Furniture', 'Ergonomic'],
    isPrivate: true,
    isDibbed: false,
    description: 'Working from home permanently now. This chair would save my back during long coding sessions.',
    dateAdded: new Date('2024-02-28'),
    collectionId: 'office'
  },
  {
    id: 'wish-015',
    name: 'Le Creuset Dutch Oven',
    link: 'https://lecreuset.com/dutch-oven',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    desireScore: 8,
    categoryTags: ['Kitchen', 'Cooking', 'Cookware'],
    isPrivate: false,
    isDibbed: false,
    description: 'Want to get more into cooking. This would last forever and make amazing bread and stews.',
    dateAdded: new Date('2024-03-01'),
    collectionId: 'home'
  }
];

/**
 * Predefined collections for organizing wishes
 */
export const mockCollections = [
  {
    id: 'all',
    name: 'All Items',
    icon: '📋',
    itemCount: mockWishItems.length,
    isDefault: true
  },
  {
    id: 'tech',
    name: 'Technology',
    icon: '💻',
    itemCount: mockWishItems.filter(item => item.collectionId === 'tech').length,
    isDefault: false
  },
  {
    id: 'books',
    name: 'Books & Learning',
    icon: '📚',
    itemCount: mockWishItems.filter(item => item.collectionId === 'books').length,
    isDefault: false
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: '👕',
    itemCount: mockWishItems.filter(item => item.collectionId === 'fashion').length,
    isDefault: false
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: '🎮',
    itemCount: mockWishItems.filter(item => item.collectionId === 'gaming').length,
    isDefault: false
  },
  {
    id: 'home',
    name: 'Home & Kitchen',
    icon: '🏠',
    itemCount: mockWishItems.filter(item => item.collectionId === 'home').length,
    isDefault: false
  },
  {
    id: 'outdoor',
    name: 'Outdoor & Sports',
    icon: '🏔️',
    itemCount: mockWishItems.filter(item => item.collectionId === 'outdoor').length,
    isDefault: false
  },
  {
    id: 'office',
    name: 'Office & Work',
    icon: '💼',
    itemCount: mockWishItems.filter(item => item.collectionId === 'office').length,
    isDefault: false
  }
];

/**
 * Available category tags
 */
export const mockCategories = [
  // Electronics
  'Electronics', 'Laptop', 'Audio', 'Smart Watch', 'Gaming', 'E-reader',

  // Fashion
  'Fashion', 'Clothing', 'Shoes', 'Accessories', 'Casual', 'Sustainable',

  // Home & Kitchen
  'Home', 'Kitchen', 'Cooking', 'Appliances', 'Cleaning', 'Furniture', 'Cookware',

  // Work & Learning
  'Work', 'Office', 'Books', 'Learning', 'Design', 'Stationery', 'Writing', 'Organization', 'Ergonomic',

  // Outdoor & Health
  'Outdoor', 'Travel', 'Weather', 'Health', 'Fitness', 'Hydration',

  // Entertainment
  'Entertainment', 'Reading'
];

/**
 * Utility functions for mock data
 */
export const mockUtils = {
  /**
   * Get items by collection
   */
  getItemsByCollection: (collectionId) => {
    if (collectionId === 'all') return mockWishItems;
    return mockWishItems.filter(item => item.collectionId === collectionId);
  },

  /**
   * Get items by category tag
   */
  getItemsByCategory: (categoryTag) => {
    return mockWishItems.filter(item =>
      item.categoryTags.includes(categoryTag)
    );
  },

  /**
   * Get dibbed items
   */
  getDibbedItems: () => {
    return mockWishItems.filter(item => item.isDibbed);
  },

  /**
   * Get available items (not dibbed)
   */
  getAvailableItems: () => {
    return mockWishItems.filter(item => !item.isDibbed);
  },

  /**
   * Get private items
   */
  getPrivateItems: () => {
    return mockWishItems.filter(item => item.isPrivate);
  },

  /**
   * Get public items
   */
  getPublicItems: () => {
    return mockWishItems.filter(item => !item.isPrivate);
  },

  /**
   * Search items by name or description
   */
  searchItems: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return mockWishItems.filter(item =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.categoryTags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  },

  /**
   * Filter items by desire score range
   */
  getItemsByDesireScore: (minScore, maxScore) => {
    return mockWishItems.filter(item =>
      item.desireScore >= minScore && item.desireScore <= maxScore
    );
  },

  /**
   * Get random item for testing
   */
  getRandomItem: () => {
    return mockWishItems[Math.floor(Math.random() * mockWishItems.length)];
  },

  /**
   * Generate item counts for collections
   */
  updateCollectionCounts: () => {
    return mockCollections.map(collection => ({
      ...collection,
      itemCount: collection.id === 'all'
        ? mockWishItems.length
        : mockWishItems.filter(item => item.collectionId === collection.id).length
    }));
  }
};

/**
 * Mock backend function signatures for reference
 * These represent the structure of functions needed for the wishlist
 */
export const backendFunctions = {
  // TODO: Implement these functions in your backend

  /**
   * Fetch wish items with optional filtering
   * @param {string} userId - User ID
   * @param {string} collectionId - Optional collection filter
   * @param {object} filters - Optional filters (category, desireScore, etc.)
   * @returns {Promise<Array>} Array of wish items
   */
  fetchWishItems: async (userId, collectionId = null, filters = {}) => {
    // TODO: Implement database query with filtering
    throw new Error('Not implemented');
  },

  /**
   * Create new wish item
   * @param {string} userId - User ID
   * @param {object} wishData - Wish item data
   * @returns {Promise<object>} Created wish item
   */
  createWishItem: async (userId, wishData) => {
    // TODO: Validate data and insert into database
    throw new Error('Not implemented');
  },

  /**
   * Update existing wish item
   * @param {string} wishId - Wish item ID
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} Updated wish item
   */
  updateWishItem: async (wishId, updates) => {
    // TODO: Validate and update database record
    throw new Error('Not implemented');
  },

  /**
   * Delete wish item
   * @param {string} wishId - Wish item ID
   * @returns {Promise<boolean>} Success status
   */
  deleteWishItem: async (wishId) => {
    // TODO: Remove from database
    throw new Error('Not implemented');
  },

  /**
   * Delete multiple wish items
   * @param {Array<string>} wishIds - Array of wish item IDs
   * @returns {Promise<number>} Number of deleted items
   */
  deleteMultipleWishItems: async (wishIds) => {
    // TODO: Bulk delete operation
    throw new Error('Not implemented');
  },

  /**
   * Fetch user's collections
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of collections
   */
  fetchCollections: async (userId) => {
    // TODO: Query user's collections
    throw new Error('Not implemented');
  },

  /**
   * Create new collection
   * @param {string} userId - User ID
   * @param {object} collectionData - Collection data
   * @returns {Promise<object>} Created collection
   */
  createCollection: async (userId, collectionData) => {
    // TODO: Create new collection
    throw new Error('Not implemented');
  },

  /**
   * Update collection
   * @param {string} collectionId - Collection ID
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} Updated collection
   */
  updateCollection: async (collectionId, updates) => {
    // TODO: Update collection
    throw new Error('Not implemented');
  },

  /**
   * Delete collection
   * @param {string} collectionId - Collection ID
   * @returns {Promise<boolean>} Success status
   */
  deleteCollection: async (collectionId) => {
    // TODO: Delete collection and handle items
    throw new Error('Not implemented');
  },

  /**
   * Toggle dibs status on item
   * @param {string} wishId - Wish item ID
   * @param {string} userId - User ID claiming dibs
   * @returns {Promise<object>} Updated wish item
   */
  toggleDibs: async (wishId, userId) => {
    // TODO: Toggle dibs status
    throw new Error('Not implemented');
  },

  /**
   * Update privacy status
   * @param {string} wishId - Wish item ID
   * @param {boolean} isPrivate - Privacy status
   * @returns {Promise<object>} Updated wish item
   */
  updatePrivacyStatus: async (wishId, isPrivate) => {
    // TODO: Update privacy status
    throw new Error('Not implemented');
  },

  /**
   * Add item to collection
   * @param {string} wishId - Wish item ID
   * @param {string} collectionId - Collection ID
   * @returns {Promise<object>} Updated wish item
   */
  addToCollection: async (wishId, collectionId) => {
    // TODO: Move item to collection
    throw new Error('Not implemented');
  },

  /**
   * Remove item from collection
   * @param {string} wishId - Wish item ID
   * @returns {Promise<object>} Updated wish item
   */
  removeFromCollection: async (wishId) => {
    // TODO: Remove from collection (set to default)
    throw new Error('Not implemented');
  },

  /**
   * Validate wish item data
   * @param {object} wishData - Wish item data to validate
   * @returns {object} Validation result with errors if any
   */
  validateWishItem: (wishData) => {
    // TODO: Implement validation logic
    const errors = [];

    if (!wishData.name || wishData.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!wishData.link || !isValidUrl(wishData.link)) {
      errors.push('Valid link is required');
    }

    if (!wishData.desireScore || wishData.desireScore < 1 || wishData.desireScore > 10) {
      errors.push('Desire score must be between 1 and 10');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Extract metadata from product URL
   * @param {string} url - Product URL
   * @returns {Promise<object>} Extracted metadata (title, image, description)
   */
  extractMetadataFromUrl: async (url) => {
    // TODO: Implement URL scraping for metadata
    throw new Error('Not implemented');
  },

  /**
   * Generate optimized thumbnail
   * @param {string} imageUrl - Original image URL
   * @returns {Promise<string>} Thumbnail URL
   */
  generateThumbnail: async (imageUrl) => {
    // TODO: Implement image processing
    throw new Error('Not implemented');
  }
};

// Helper function for URL validation
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}