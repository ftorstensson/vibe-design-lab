// src/types/design-system.ts

export type ComponentCategory = 'Layout' | 'Navigation' | 'Inputs' | 'Buttons' | 'Media' | 'Display' | 'Annotation';

export type ComponentType = 
  // Containers
  | 'MobileScreen'
  // Layout
  | 'Card' | 'Divider' | 'Stack'
  // Navigation
  | 'Header' | 'TabBar'
  // Inputs
  | 'InputField' | 'Checkbox' | 'Switch'
  // Buttons
  | 'PrimaryButton' | 'SecondaryButton'
  // Media
  | 'ImagePlaceholder' | 'Avatar'
  // Display
  | 'TextLabel' | 'ListItem' | 'Badge'
  // Annotation
  | 'StickyNote' | 'Arrow' | 'CommentBadge' | 'HighlightBox';

export interface ComponentSchema {
  id: string;
  type: ComponentType;
  label: string;
  category: ComponentCategory;
  icon: string; // Lucide icon name
  defaultProps?: Record<string, any>;
}

// THE VIBE STANDARD LIBRARY
export const COMPONENT_LIBRARY: ComponentSchema[] = [
  // --- LAYOUT ---
  { id: 'card', type: 'Card', label: 'Card', category: 'Layout', icon: 'Square', defaultProps: { shadow: true } },
  { id: 'divider', type: 'Divider', label: 'Divider', category: 'Layout', icon: 'Minus', defaultProps: { orientation: 'horizontal' } },
  { id: 'stack', type: 'Stack', label: 'Stack / Group', category: 'Layout', icon: 'Layers', defaultProps: { direction: 'column', spacing: 16 } },

  // --- NAVIGATION ---
  { id: 'header', type: 'Header', label: 'Page Header', category: 'Navigation', icon: 'PanelTop', defaultProps: { title: 'Header' } },
  { id: 'tabbar', type: 'TabBar', label: 'Tab Bar', category: 'Navigation', icon: 'PanelBottom', defaultProps: { activeTab: 0 } },

  // --- INPUTS ---
  { id: 'input', type: 'InputField', label: 'Input Field', category: 'Inputs', icon: 'Type', defaultProps: { placeholder: 'Enter text...' } },
  { id: 'checkbox', type: 'Checkbox', label: 'Checkbox', category: 'Inputs', icon: 'CheckSquare', defaultProps: { checked: false } },
  { id: 'switch', type: 'Switch', label: 'Switch', category: 'Inputs', icon: 'ToggleRight', defaultProps: { enabled: false } },

  // --- BUTTONS ---
  { id: 'btn-primary', type: 'PrimaryButton', label: 'Primary Button', category: 'Buttons', icon: 'MousePointerClick', defaultProps: { label: 'Button', variant: 'filled' } },
  { id: 'btn-secondary', type: 'SecondaryButton', label: 'Secondary Button', category: 'Buttons', icon: 'MousePointer2', defaultProps: { label: 'Cancel', variant: 'outlined' } },

  // --- MEDIA ---
  { id: 'image', type: 'ImagePlaceholder', label: 'Image Box', category: 'Media', icon: 'Image', defaultProps: { width: 100, height: 100 } },
  { id: 'avatar', type: 'Avatar', label: 'User Avatar', category: 'Media', icon: 'CircleUser', defaultProps: { size: 40, shape: 'circle' } },

  // --- DISPLAY ---
  { id: 'text', type: 'TextLabel', label: 'Text Label', category: 'Display', icon: 'AlignLeft', defaultProps: { text: 'Label', fontSize: 16 } },
  { id: 'listitem', type: 'ListItem', label: 'List Item', category: 'Display', icon: 'List', defaultProps: { title: 'Title', subtitle: 'Subtitle', chevron: true } },
  { id: 'badge', type: 'Badge', label: 'Notification Badge', category: 'Display', icon: 'Bell', defaultProps: { text: '1', color: 'red' } },

  // --- ANNOTATIONS (Meta Layer) ---
  { id: 'sticky', type: 'StickyNote', label: 'Sticky Note', category: 'Annotation', icon: 'StickyNote', defaultProps: { text: 'Comment...', color: '#FFFF99' } },
  { id: 'highlight', type: 'HighlightBox', label: 'Highlight Area', category: 'Annotation', icon: 'Focus', defaultProps: { color: 'yellow', opacity: 0.3 } },
];