import React from 'react';
import { 
  Square, Minus, Layers, PanelTop, PanelBottom, 
  Type, CheckSquare, ToggleRight, MousePointerClick, MousePointer2,
  Image, CircleUser, AlignLeft, List, Bell, 
  StickyNote, Focus, Smartphone, Palette, GripVertical, ChevronDown
} from 'lucide-react';
import { COMPONENT_LIBRARY, ComponentCategory, ComponentType } from '@/types/design-system';

// Icon Map
const IconMap: Record<string, React.ElementType> = {
  Square, Minus, Layers, PanelTop, PanelBottom, 
  Type, CheckSquare, ToggleRight, MousePointerClick, MousePointer2,
  Image, CircleUser, AlignLeft, List, Bell, 
  StickyNote, Focus
};

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: ComponentType, defaultProps: any) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/props', JSON.stringify(defaultProps));
    event.dataTransfer.effectAllowed = 'move';
  };

  const categories: Record<string, typeof COMPONENT_LIBRARY> = {
    'Layout & Nav': COMPONENT_LIBRARY.filter(c => ['Layout', 'Navigation'].includes(c.category)),
    'Inputs & Buttons': COMPONENT_LIBRARY.filter(c => ['Inputs', 'Buttons'].includes(c.category)),
    'Content': COMPONENT_LIBRARY.filter(c => ['Media', 'Display'].includes(c.category)),
    'Annotations': COMPONENT_LIBRARY.filter(c => c.category === 'Annotation'),
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full z-10 shadow-xl overflow-y-auto font-sans">
      
      {/* HEADER */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
        <h2 className="font-bold text-slate-900 text-xs flex items-center gap-2 tracking-widest">
          <Palette className="w-4 h-4 text-purple-600" />
          VIBE LIBRARY
        </h2>
      </div>

      <div className="p-4 space-y-8">
        
        {/* SPECIAL: CONTAINER */}
        <section>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
            Roots
          </h3>
          <div
            onDragStart={(e) => onDragStart(e, 'MobileScreen', { label: 'New Screen' })}
            draggable
            className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-xl cursor-grab hover:shadow-md transition-all active:cursor-grabbing group"
          >
            <GripVertical className="w-4 h-4 text-purple-300 group-hover:text-purple-500" />
            <div className="p-1.5 bg-white rounded border border-purple-100">
                <Smartphone className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm font-bold text-purple-900">Mobile Screen</span>
          </div>
        </section>

        {/* DYNAMIC CATEGORIES */}
        {Object.entries(categories).map(([cat, items]) => (
          <section key={cat}>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{cat}</h3>
            <div className="grid grid-cols-2 gap-2">
              {items.map((item) => {
                const Icon = IconMap[item.icon] || Square;
                return (
                  <div
                    key={item.id}
                    onDragStart={(e) => onDragStart(e, item.type, item.defaultProps)}
                    draggable
                    className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-lg cursor-grab hover:border-purple-400 hover:bg-purple-50/50 transition-all active:cursor-grabbing group aspect-square text-center"
                    title={item.label}
                  >
                    <Icon className="w-6 h-6 text-slate-400 group-hover:text-purple-600 mb-2 transition-colors" />
                    <span className="text-[10px] font-medium text-slate-600 group-hover:text-slate-900 leading-tight">
                        {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

      </div>
    </aside>
  );
};