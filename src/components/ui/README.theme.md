# Using Theme Controls in Components

This guide shows you how to use the dark mode toggle and color theme selector in any component or module throughout your application.

## 🎯 Overview

Your app has two theme systems:
1. **Dark/Light Mode**: Controls overall brightness (dark/light backgrounds)
2. **Color Themes**: Controls accent colors (blue, purple, green, red, etc.)

Both automatically work across all components using your design system.

## 📦 Available Theme Components

### 1. ThemeToggle (Dark/Light Mode)
### 2. ColorThemeSelector (Accent Colors)

## 🔧 Basic Usage

### Import and Use Theme Components

```jsx
import ThemeToggle from '../ui/ThemeToggle';
import ColorThemeSelector from '../ui/ColorThemeSelector';

function MyComponent() {
  return (
    <div className="flex items-center space-x-4">
      <ThemeToggle />
      <ColorThemeSelector />
    </div>
  );
}
```

### Custom Styling

Both components accept a `className` prop:

```jsx
// Smaller theme controls
<ThemeToggle className="scale-75" />
<ColorThemeSelector className="scale-75" />

// Custom positioning
<ThemeToggle className="absolute top-4 right-4" />

// Custom colors (overrides theme)
<ThemeToggle className="bg-red-100 border-red-300" />
```

## 🎨 Using Theme Context

### Access Current Theme Values

```jsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, colorTheme, isDark } = useTheme();

  return (
    <div>
      <p>Current mode: {theme}</p>        {/* 'light' or 'dark' */}
      <p>Current color: {colorTheme}</p>   {/* 'blue', 'purple', etc. */}
      <p>Is dark mode: {isDark}</p>        {/* true or false */}
    </div>
  );
}
```

### Programmatically Change Themes

```jsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { toggleTheme, changeColorTheme } = useTheme();

  const handleDarkModeToggle = () => {
    toggleTheme(); // Switches between light/dark
  };

  const handleColorChange = (color) => {
    changeColorTheme(color); // Changes to specific color
  };

  return (
    <div>
      <button onClick={handleDarkModeToggle}>
        Toggle Dark Mode
      </button>

      <button onClick={() => handleColorChange('purple')}>
        Use Purple Theme
      </button>
    </div>
  );
}
```

## 🎨 Using Theme-Aware Styling

### Semantic Color Classes (Recommended)

Use semantic classes that automatically adapt to themes:

```jsx
function MyComponent() {
  return (
    <div className="bg-background text-foreground border border-border">
      <h1 className="text-primary-600">This adapts to color theme</h1>
      <p className="text-muted">This adapts to dark/light mode</p>
      <button className="bg-primary-500 hover:bg-primary-600 text-white">
        This button changes with color theme
      </button>
    </div>
  );
}
```

### Available Semantic Colors

| Class | Purpose | Adapts To |
|-------|---------|-----------|
| `bg-background` | Main background | Dark/Light |
| `bg-surface` | Card backgrounds | Dark/Light |
| `text-foreground` | Main text | Dark/Light |
| `text-muted` | Secondary text | Dark/Light |
| `border-border` | Borders | Dark/Light |
| `bg-primary-500` | Brand color | Color Theme |
| `bg-primary-50` | Light brand | Color Theme |
| `text-primary-600` | Brand text | Color Theme |

### Conditional Styling Based on Theme

```jsx
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../utils/cn';

function MyComponent() {
  const { isDark, colorTheme } = useTheme();

  return (
    <div className={cn(
      'p-4 rounded-lg transition-all duration-200',
      // Conditional based on dark mode
      isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900',
      // Conditional based on color theme
      colorTheme === 'purple' && 'ring-2 ring-purple-500',
      colorTheme === 'green' && 'ring-2 ring-green-500'
    )}>
      <h2>Theme-aware component</h2>
    </div>
  );
}
```

## 🎯 Real-World Examples

### 1. Settings Panel with Theme Controls

```jsx
import ThemeToggle from '../ui/ThemeToggle';
import ColorThemeSelector from '../ui/ColorThemeSelector';
import { useTheme } from '../contexts/ThemeContext';

function SettingsPanel() {
  const { theme, colorTheme } = useTheme();

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h2 className="text-responsive-lg font-semibold text-foreground mb-4">
        Appearance Settings
      </h2>

      <div className="space-y-4">
        {/* Dark Mode Setting */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-responsive-base font-medium text-foreground">
              Dark Mode
            </h3>
            <p className="text-responsive-sm text-muted">
              Currently: {theme === 'dark' ? 'Dark' : 'Light'}
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Color Theme Setting */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-responsive-base font-medium text-foreground">
              Color Theme
            </h3>
            <p className="text-responsive-sm text-muted">
              Currently: {colorTheme}
            </p>
          </div>
          <ColorThemeSelector />
        </div>
      </div>
    </div>
  );
}
```

### 2. Hero Section with Theme-Aware Styling

```jsx
import { useTheme } from '../contexts/ThemeContext';

function HeroSection() {
  const { isDark } = useTheme();

  return (
    <section className={cn(
      'min-h-screen flex items-center justify-center relative',
      'bg-gradient-to-br from-primary-50 to-primary-100',
      isDark && 'from-gray-900 to-gray-800'
    )}>
      {/* Background decoration */}
      <div className={cn(
        'absolute inset-0 opacity-20',
        isDark ? 'bg-primary-900' : 'bg-primary-200'
      )} />

      <div className="relative z-10 text-center">
        <h1 className="text-responsive-6xl font-bold text-foreground">
          Welcome to EyeWantIt
        </h1>
        <p className="text-responsive-xl text-muted mt-4">
          Create wishlists, share with friends
        </p>
        <button className="mt-8 bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg">
          Get Started
        </button>
      </div>
    </section>
  );
}
```

### 3. Card Component with Theme Integration

```jsx
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

function Card({ children, title }) {
  const { colorTheme } = useTheme();

  return (
    <div className="bg-surface border border-border rounded-lg shadow-soft overflow-hidden">
      {/* Header with theme controls */}
      <div className={cn(
        'px-6 py-4 border-b border-border flex items-center justify-between',
        'bg-gradient-to-r from-primary-50 to-primary-100'
      )}>
        <h3 className="text-responsive-lg font-semibold text-foreground">
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <ThemeToggle className="scale-75" />
          <ColorThemeSelector className="scale-75" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 text-foreground">
        {children}
      </div>

      {/* Footer with theme indicator */}
      <div className="px-6 py-3 bg-surface border-t border-border">
        <span className="text-responsive-xs text-muted">
          Theme: {colorTheme}
        </span>
      </div>
    </div>
  );
}
```

## 🎨 Advanced Usage

### Custom Theme Context

```jsx
import { useTheme } from '../contexts/ThemeContext';

function AdvancedComponent() {
  const { theme, colorTheme, toggleTheme, changeColorTheme, isLoading } = useTheme();

  // Wait for theme to load
  if (isLoading) {
    return <div>Loading theme...</div>;
  }

  // Custom theme logic
  const customThemeClass = `theme-${theme}-${colorTheme}`;

  return (
    <div className={customThemeClass}>
      {/* Your component content */}
    </div>
  );
}
```

### Theme-Aware Animations

```jsx
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

function AnimatedComponent() {
  const { isDark } = useTheme();

  return (
    <motion.div
      className="bg-surface rounded-lg p-6"
      animate={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a'
      }}
      transition={{ duration: 0.3 }}
    >
      Content that animates with theme changes
    </motion.div>
  );
}
```

## ⚠️ Best Practices

1. **Use semantic classes**: Prefer `bg-background` over `bg-white`
2. **Test both themes**: Always check light AND dark modes
3. **Respect user preference**: Don't force theme changes
4. **Performance**: Use CSS variables, not inline styles
5. **Accessibility**: Maintain proper contrast ratios

## 🧪 Testing Themes

```jsx
// Test component that shows all theme states
function ThemeTestComponent() {
  const { theme, colorTheme, toggleTheme, changeColorTheme } = useTheme();

  const colors = ['blue', 'purple', 'green', 'red', 'orange', 'pink'];

  return (
    <div className="p-6 bg-background">
      <h2>Theme Testing</h2>

      {/* Current state */}
      <p>Mode: {theme} | Color: {colorTheme}</p>

      {/* Theme controls */}
      <button onClick={toggleTheme}>Toggle Dark Mode</button>

      {/* Color options */}
      <div className="flex space-x-2 mt-4">
        {colors.map(color => (
          <button
            key={color}
            onClick={() => changeColorTheme(color)}
            className={`px-3 py-1 rounded bg-${color}-500 text-white`}
          >
            {color}
          </button>
        ))}
      </div>

      {/* Theme components */}
      <div className="flex space-x-4 mt-4">
        <ThemeToggle />
        <ColorThemeSelector />
      </div>
    </div>
  );
}
```

# Adding More Color Themes

This guide shows you how to add new color themes to your application's theme system.

## 🎯 Overview

Your app supports multiple color themes (blue, purple, green, etc.) that change the accent colors throughout the interface. Adding a new color theme requires updates to two files:

1. **ColorThemeSelector component** - Add the option to the dropdown
2. **Design system CSS** - Define the color variables

## 📍 Files to Modify

### 1. `src/components/ui/ColorThemeSelector.jsx`
### 2. `src/styles/design-system.css`

## 🔧 Step-by-Step Instructions

### Step 1: Add Color Option to Selector

Open `src/components/ui/ColorThemeSelector.jsx` and find the `colorOptions` array:

```javascript
// TO ADD MORE COLORS: Simply add them to this array
const colorOptions = [
  { id: 'blue', name: 'Blue', preview: 'bg-blue-500' },
  { id: 'purple', name: 'Purple', preview: 'bg-purple-500' },
  { id: 'green', name: 'Green', preview: 'bg-green-500' },
  { id: 'red', name: 'Red', preview: 'bg-red-500' },
  { id: 'orange', name: 'Orange', preview: 'bg-orange-500' },
  { id: 'pink', name: 'Pink', preview: 'bg-pink-500' },
  { id: 'indigo', name: 'Indigo', preview: 'bg-indigo-500' },
  { id: 'emerald', name: 'Emerald', preview: 'bg-emerald-500' },
];
```

#### Add your new color:

```javascript
const colorOptions = [
  // ... existing colors
  { id: 'yellow', name: 'Yellow', preview: 'bg-yellow-500' },     // NEW
  { id: 'teal', name: 'Teal', preview: 'bg-teal-500' },           // NEW
  { id: 'rose', name: 'Rose', preview: 'bg-rose-500' },           // NEW
];
```

### Step 2: Add CSS Variables

Open `src/styles/design-system.css` and add CSS variable definitions for your new colors.

#### Find the color theme section:

```css
/* COLOR THEME VARIANTS */

/* Blue (Default) */
[data-color-theme="blue"] {
  --color-primary-50: 240 249 255;
  --color-primary-100: 219 234 254;
  --color-primary-500: 59 130 246;
  --color-primary-600: 37 99 235;
  --color-primary-900: 30 58 138;
}

/* Purple */
[data-color-theme="purple"] {
  --color-primary-50: 250 245 255;
  --color-primary-100: 243 232 255;
  --color-primary-500: 168 85 247;
  --color-primary-600: 147 51 234;
  --color-primary-900: 88 28 135;
}

/* ... other existing colors */
```

#### Add your new color definitions:

```css
/* Yellow */
[data-color-theme="yellow"] {
  --color-primary-50: 254 249 195;
  --color-primary-100: 254 240 138;
  --color-primary-500: 234 179 8;
  --color-primary-600: 202 138 4;
  --color-primary-900: 113 63 18;
}

/* Teal */
[data-color-theme="teal"] {
  --color-primary-50: 240 253 250;
  --color-primary-100: 204 251 241;
  --color-primary-500: 20 184 166;
  --color-primary-600: 13 148 136;
  --color-primary-900: 19 78 74;
}

/* Rose */
[data-color-theme="rose"] {
  --color-primary-50: 255 241 242;
  --color-primary-100: 255 228 230;
  --color-primary-500: 244 63 94;
  --color-primary-600: 225 29 72;
  --color-primary-900: 136 19 55;
}
```

## 🎨 Finding Color Values

### Option 1: Use Tailwind Color Palette

Visit [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors) and copy the RGB values:

```css
/* Example: For Tailwind Violet */
[data-color-theme="violet"] {
  --color-primary-50: 245 243 255;    /* violet-50 */
  --color-primary-100: 237 233 254;   /* violet-100 */
  --color-primary-500: 139 92 246;    /* violet-500 */
  --color-primary-600: 124 58 237;    /* violet-600 */
  --color-primary-900: 76 29 149;     /* violet-900 */
}
```

### Option 2: Use Color Palette Generators

1. **Coolors.co**: Generate harmonious color schemes
2. **Adobe Color**: Create professional palettes
3. **Material Design Colors**: Use Material Design palette

### Option 3: Custom Brand Colors

```css
/* Example: Custom brand colors */
[data-color-theme="brand"] {
  --color-primary-50: 248 250 255;    /* Very light brand */
  --color-primary-100: 230 240 255;   /* Light brand */
  --color-primary-500: 45 105 200;    /* Main brand color */
  --color-primary-600: 35 85 170;     /* Darker brand */
  --color-primary-900: 15 35 80;      /* Very dark brand */
}
```

## 📋 Color Variable Requirements

Each color theme needs exactly **5 shades**:

| Variable | Purpose | Example Use |
|----------|---------|-------------|
| `--color-primary-50` | Very light backgrounds | Button hover states, light accents |
| `--color-primary-100` | Light backgrounds | Card backgrounds, subtle highlights |
| `--color-primary-500` | Main brand color | Primary buttons, links, icons |
| `--color-primary-600` | Darker brand | Button hover, active states |
| `--color-primary-900` | Very dark | Text on light backgrounds |

## 🧪 Testing Your New Color

### 1. Test the Color Selector

1. Start your development server
2. Open the color theme dropdown
3. Verify your new color appears with the correct preview
4. Click it and verify the theme changes

### 2. Visual Testing

Check these elements change color:
- Primary buttons
- Navigation active states
- Links and accent text
- Focus rings
- Badge primary variant
- Logo background

### 3. Complete Example

Here's adding a "Cyan" theme from start to finish:

#### ColorThemeSelector.jsx
```javascript
const colorOptions = [
  { id: 'blue', name: 'Blue', preview: 'bg-blue-500' },
  { id: 'purple', name: 'Purple', preview: 'bg-purple-500' },
  { id: 'green', name: 'Green', preview: 'bg-green-500' },
  { id: 'cyan', name: 'Cyan', preview: 'bg-cyan-500' },  // NEW
  // ... other colors
];
```

#### design-system.css
```css
/* Cyan */
[data-color-theme="cyan"] {
  --color-primary-50: 236 254 255;
  --color-primary-100: 207 250 254;
  --color-primary-500: 6 182 212;
  --color-primary-600: 8 145 178;
  --color-primary-900: 22 78 99;
}
```

## 🎨 Advanced: Creating Theme Variations

### Dark Mode Specific Colors

You can create colors that look different in dark mode:

```css
/* Base cyan theme */
[data-color-theme="cyan"] {
  --color-primary-50: 236 254 255;
  --color-primary-100: 207 250 254;
  --color-primary-500: 6 182 212;
  --color-primary-600: 8 145 178;
  --color-primary-900: 22 78 99;
}

/* Darker cyan for dark mode */
[data-theme="dark"][data-color-theme="cyan"] {
  --color-primary-50: 22 78 99;      /* Reversed for dark mode */
  --color-primary-100: 8 145 178;    /* Darker shades */
  --color-primary-500: 34 211 238;   /* Brighter for dark backgrounds */
  --color-primary-600: 6 182 212;    /* Main color */
  --color-primary-900: 236 254 255;  /* Light for text */
}
```

### Seasonal or Special Themes

```css
/* Halloween Theme */
[data-color-theme="halloween"] {
  --color-primary-50: 255 247 237;   /* Light orange */
  --color-primary-100: 255 237 213;
  --color-primary-500: 249 115 22;   /* Orange */
  --color-primary-600: 234 88 12;
  --color-primary-900: 67 20 7;      /* Dark orange/brown */
}

/* Christmas Theme */
[data-color-theme="christmas"] {
  --color-primary-50: 240 253 244;   /* Light green */
  --color-primary-100: 220 252 231;
  --color-primary-500: 34 197 94;    /* Christmas green */
  --color-primary-600: 22 163 74;
  --color-primary-900: 20 83 45;     /* Dark green */
}
```

## 🔄 Dynamic Color Management

### Programmatically Adding Colors

You can also add colors programmatically by extending the ThemeContext:

```javascript
// In your ThemeContext.jsx, add validation
const validateColorTheme = (colorTheme) => {
  const validColors = [
    'blue', 'purple', 'green', 'red', 'orange',
    'pink', 'indigo', 'emerald', 'yellow', 'teal', 'rose'
  ];
  return validColors.includes(colorTheme) ? colorTheme : 'blue';
};
```

### Loading Colors from API

```javascript
// Example: Loading theme options from server
const [availableColors, setAvailableColors] = useState([]);

useEffect(() => {
  fetch('/api/theme-colors')
    .then(res => res.json())
    .then(colors => setAvailableColors(colors));
}, []);
```

## ⚠️ Important Notes

### 1. Color Format
- Always use **RGB values without commas**: `59 130 246` not `rgb(59, 130, 246)`
- This format works with Tailwind's opacity utilities: `bg-primary-500/50`

### 2. Consistency
- Keep the same relative contrast between shades
- Test accessibility with tools like WebAIM's contrast checker
- Ensure colors work in both light and dark modes

### 3. Performance
- CSS variables are applied instantly when changed
- No need to reload the page
- Changes persist in localStorage automatically

### 4. Naming Convention
- Use descriptive names: `ocean`, `forest`, `sunset`
- Or standard color names: `red`, `blue`, `green`
- Avoid brand names unless they're your own

## 🧪 Testing Checklist

After adding a new color theme:

- [ ] Color appears in dropdown selector
- [ ] Preview dot shows correct color
- [ ] Clicking applies the theme immediately
- [ ] Primary buttons change color
- [ ] Navigation active states update
- [ ] Focus rings use new color
- [ ] Links and accent text update
- [ ] Works in both light and dark modes
- [ ] Color persists after page refresh
- [ ] Accessibility contrast is adequate

## 🎨 Color Inspiration

### Professional Palettes
- **Corporate Blue**: `#1e40af` (blue-800)
- **Success Green**: `#059669` (emerald-600)
- **Warning Amber**: `#d97706` (amber-600)
- **Error Red**: `#dc2626` (red-600)

### Creative Palettes
- **Ocean**: Cyan + Teal variations
- **Forest**: Green + Emerald variations
- **Sunset**: Orange + Rose variations
- **Royal**: Purple + Indigo variations

### Accessibility-First Colors
- High contrast ratios (4.5:1 minimum)
- Distinct from other colors for colorblind users
- Clear difference between light and dark shades

Your color theme system is now ready to support unlimited color variations while maintaining consistency and accessibility across your entire application!