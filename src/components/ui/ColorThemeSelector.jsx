import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';

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

const ColorThemeSelector = ({ className }) => {
  const { colorTheme, changeColorTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-surface border border-border hover:bg-primary-50 transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Palette className="w-4 h-4 text-foreground" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 p-2 bg-background border border-border rounded-lg shadow-strong z-50 min-w-[180px]"
            >
              <div className="text-xs font-medium text-muted mb-2 px-2">
                Theme Color
              </div>
              {colorOptions.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => {
                    changeColorTheme(option.id);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-md hover:bg-surface transition-colors duration-200"
                  whileHover={{ x: 2 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn("w-4 h-4 rounded-full border border-border", option.preview)} />
                    <span className="text-sm text-foreground">{option.name}</span>
                  </div>
                  {colorTheme === option.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <Check className="w-3 h-3 text-primary-500" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorThemeSelector;