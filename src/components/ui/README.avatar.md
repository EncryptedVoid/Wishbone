# Adding Buttons to Avatar Menu

This guide shows you how to add new menu items to the user avatar dropdown in both desktop and mobile navbars.

## 📍 Files to Modify

### Desktop: `src/components/navbar/Navbar.desktop.jsx`
### Mobile: `src/components/navbar/Navbar.mobile.jsx`

## 🔧 Step-by-Step Instructions

### 1. Find the User Menu Items Array

In both files, locate the `userMenuItems` array:

```javascript
// User menu items - consolidated Friends and Notifications here
const userMenuItems = [
  { path: '/friends', label: 'Friends', icon: Users },
  { path: '/settings', label: 'Settings', icon: Settings },
  {
    action: () => {},
    label: 'Notifications',
    icon: Bell,
    badge: 3, // You can make this dynamic
    isAction: true
  }
];
```

### 2. Understanding Menu Item Types

There are **two types** of menu items:

#### A) Navigation Items (go to a page)
```javascript
{
  path: '/profile',           // Route path
  label: 'Profile',          // Display text
  icon: User                 // Lucide React icon
}
```

#### B) Action Items (trigger a function)
```javascript
{
  action: () => handleLogout(),  // Function to execute
  label: 'Sign Out',            // Display text
  icon: LogOut,                 // Lucide React icon
  badge: 5,                     // Optional: number badge
  isAction: true                // Required: marks as action item
}
```

### 3. Adding New Menu Items

#### Example 1: Add a Profile Page Link
```javascript
// Import the icon at the top of the file
import { User, Settings, LogOut, Calendar, Users, Heart, Camera, ChevronDown, Bell, UserPlus, UserCircle } from 'lucide-react';

// Add to userMenuItems array
const userMenuItems = [
  { path: '/profile', label: 'My Profile', icon: UserCircle },  // NEW ITEM
  { path: '/friends', label: 'Friends', icon: Users },
  { path: '/settings', label: 'Settings', icon: Settings },
  // ... rest of items
];
```

#### Example 2: Add a Help Action
```javascript
// Import the icon
import { HelpCircle } from 'lucide-react';

// Add to userMenuItems array
const userMenuItems = [
  { path: '/friends', label: 'Friends', icon: Users },
  {
    action: () => window.open('/help', '_blank'),
    label: 'Help & Support',
    icon: HelpCircle,
    isAction: true
  },  // NEW ITEM
  { path: '/settings', label: 'Settings', icon: Settings },
  // ... rest of items
];
```

#### Example 3: Add Item with Badge (like notifications)
```javascript
// Import the icon
import { Mail } from 'lucide-react';

// Add to userMenuItems array (you'll need state for dynamic badge)
const [messageCount] = useState(12); // Add this with other useState hooks

const userMenuItems = [
  { path: '/friends', label: 'Friends', icon: Users },
  {
    action: () => navigate('/messages'),
    label: 'Messages',
    icon: Mail,
    badge: messageCount,
    isAction: true
  },  // NEW ITEM
  // ... rest of items
];
```

### 4. Common Icons Available

Import any of these from `lucide-react`:

```javascript
// User & Profile
User, UserCircle, UserPlus, Users

// Communication
Mail, MessageCircle, Phone, Video

// Actions
Settings, HelpCircle, Download, Upload, Share

// Content
Camera, Image, FileText, Bookmark

// Navigation
Home, Search, Filter, MoreHorizontal
```

### 5. Complete Example

Here's a full example with multiple new items:

```javascript
// 1. Import new icons
import {
  User, Settings, LogOut, Calendar, Users, Heart, Camera,
  ChevronDown, Bell, UserPlus, UserCircle, Mail, HelpCircle, Download
} from 'lucide-react';

// 2. Add state for dynamic badges (if needed)
const [messageCount] = useState(5);
const [downloadCount] = useState(2);

// 3. Update userMenuItems array
const userMenuItems = [
  // Navigation items
  { path: '/profile', label: 'My Profile', icon: UserCircle },
  { path: '/friends', label: 'Friends', icon: Users },

  // Action items with badges
  {
    action: () => navigate('/messages'),
    label: 'Messages',
    icon: Mail,
    badge: messageCount,
    isAction: true
  },
  {
    action: () => navigate('/downloads'),
    label: 'Downloads',
    icon: Download,
    badge: downloadCount,
    isAction: true
  },

  // Standard items
  { path: '/settings', label: 'Settings', icon: Settings },

  // Help action
  {
    action: () => window.open('/help', '_blank'),
    label: 'Help & Support',
    icon: HelpCircle,
    isAction: true
  },

  // Existing notification item
  {
    action: () => {},
    label: 'Notifications',
    icon: Bell,
    badge: 3,
    isAction: true
  }
];
```

## 🎨 Styling Notes

- **Automatic theming**: All items automatically adapt to light/dark mode
- **Hover effects**: Built-in hover animations
- **Badge styling**: Badges automatically use error variant (red) for visibility
- **Icon consistency**: All icons are sized at `w-4 h-4` for consistency

## ⚠️ Important Notes

1. **Import icons**: Always import new icons at the top of the file
2. **isAction required**: Action items MUST have `isAction: true`
3. **Mobile parity**: Make the same changes in both desktop AND mobile files
4. **State management**: Dynamic badges require state management
5. **Navigation**: Use `navigate()` function for internal routes, `window.open()` for external

## 🧪 Testing

After adding items:

1. **Desktop**: Check avatar dropdown in desktop view
2. **Mobile**: Check the mobile menu user section
3. **Functionality**: Test both navigation and action items
4. **Theming**: Switch between light/dark modes to verify appearance
5. **Responsive**: Test on different screen sizes

The navbar will automatically handle the new items with consistent styling and behavior!