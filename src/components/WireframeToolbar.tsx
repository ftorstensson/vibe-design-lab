"use client";
import React, { useState } from 'react';
import { 
  Layout, Type, Image, MousePointerClick, 
  PanelTop, PanelBottom, Square, List, Minus, 
  Heading, AlignLeft, CircleUser, StickyNote,
  ChevronDown, ChevronRight, Smartphone, Layers, CheckSquare, ToggleRight, MousePointer2, Bell, Focus,
  Search, Link as LinkIcon, PlusCircle, Video, MapPin, BadgeAlert, AlignJustify
} from 'lucide-react';
import { ComponentType } from '@/types/design-system';
import { clsx } from 'clsx';

const IconMap: Record<string, React.ElementType> = {
  Layout, Type, Image, MousePointerClick, 
  PanelTop, PanelBottom, Square, List, Minus, 
  Heading, AlignLeft, CircleUser, StickyNote, 
  Layers, CheckSquare, ToggleRight, MousePointer2, Bell, Focus,
  Search, LinkIcon, PlusCircle, Video, MapPin, BadgeAlert, AlignJustify
};

export const WireframeToolbar = () => {
  const [openCategory, setOpenCategory] = useState<string | null>("Layout & Nav");

  const onDragStart = (event: React.DragEvent, nodeType: ComponentType, defaultProps: any) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/props', JSON.stringify(defaultProps));
    event.dataTransfer.effectAllowed = 'move';
  };

  const categories = {
    'Layout & Nav': [
        { id: 'header', type: 'Header', label: 'Header', icon: 'PanelTop' },
        { id: 'tabbar', type: 'TabBar', label: 'Tab Bar', icon: 'PanelBottom' },
        { id: 'search', type: 'SearchBar', label: 'Search', icon: 'Search' },
        { id: 'divider', type: 'Divider', label: 'Divider', icon: 'Minus' },
    ],
    'Inputs & Forms': [
        { id: 'input', type: 'InputField', label: 'Input', icon: 'Type' },
        { id: 'textarea', type: 'TextArea', label: 'Text Area', icon: 'AlignLeft' },
        { id: 'checkbox', type: 'Checkbox', label: 'Checkbox', icon: 'CheckSquare' },
        { id: 'switch', type: 'Switch', label: 'Switch', icon: 'ToggleRight' },
    ],
    'Actions': [
        { id: 'btn-pri', type: 'PrimaryButton', label: 'Primary', icon: 'MousePointerClick' },
        { id: 'btn-sec', type: 'SecondaryButton', label: 'Secondary', icon: 'MousePointer2' },
        { id: 'fab', type: 'FAB', label: 'FAB', icon: 'PlusCircle' },
        { id: 'link', type: 'Link', label: 'Link', icon: 'LinkIcon' },
    ],
    'Content': [
        { id: 'heading', type: 'Heading', label: 'Heading', icon: 'Heading' },
        { id: 'para', type: 'Paragraph', label: 'Paragraph', icon: 'AlignLeft' },
        { id: 'list', type: 'ListItem', label: 'List Item', icon: 'List' },
        { id: 'card', type: 'Card', label: 'Card', icon: 'Square' },
        { id: 'accordion', type: 'Accordion', label: 'Accordion', icon: 'AlignJustify' }, // NEW
        { id: 'badge', type: 'Badge', label: 'Badge', icon: 'BadgeAlert' },
    ],
    'Media': [
        { id: 'img', type: 'Image', label: 'Image', icon: 'Image' },
        { id: 'video', type: 'Video', label: 'Video', icon: 'Video' },
        { id: 'map', type: 'Map', label: 'Map', icon: 'MapPin' },
        { id: 'avatar', type: 'Avatar', label: 'Avatar', icon: 'CircleUser' },
    ]
  };

  return (
    <div className="absolute top-20 left-4 flex flex-col gap-2 z-40 animate-in slide-in-from-left-6">
      <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col w-56 max-h-[75vh] overflow-y-auto">
        <div className="pb-2 border-b border-slate-100 text-center mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wireframe Kit</span>
        </div>

        <div
          onDragStart={(e) => onDragStart(e, 'MobileScreen', { label: 'New Screen' })}
          draggable
          className="flex items-center gap-3 p-3 bg-slate-50 border-2 border-slate-200 rounded-xl cursor-grab hover:bg-slate-100 hover:border-slate-400 transition-all active:cursor-grabbing mb-2 group"
        >
          <div className="p-1 bg-white border border-slate-300 rounded group-hover:border-slate-500">
             <Smartphone className="w-4 h-4 text-slate-700" />
          </div>
          <span className="text-xs font-bold text-slate-700">Phone Screen</span>
        </div>

        {Object.entries(categories).map(([cat, items]) => {
            const isOpen = openCategory === cat;
            return (
                <div key={cat} className="border-b border-slate-100 last:border-0">
                    <button 
                        onClick={() => setOpenCategory(isOpen ? null : cat)}
                        className={clsx(
                            "w-full flex items-center justify-between p-3 text-xs font-bold transition-colors",
                            isOpen ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                        )}
                        aria-label={`Toggle ${cat}`}
                    >
                        <span>{cat}</span>
                        {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>

                    {isOpen && (
                        <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-lg mb-2">
                            {items.map((item) => {
                                const Icon = IconMap[item.icon] || Square;
                                return (
                                <div
                                    key={item.id}
                                    onDragStart={(e) => onDragStart(e, item.type as ComponentType, {})}
                                    draggable
                                    className="flex flex-col items-center justify-center p-2 bg-white border border-slate-200 rounded-lg cursor-grab hover:border-black hover:shadow-sm transition-all active:cursor-grabbing group aspect-square"
                                    title={item.label}
                                >
                                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-black mb-1" />
                                    <span className="text-[9px] font-medium text-slate-500 group-hover:text-black leading-tight text-center">
                                        {item.label}
                                    </span>
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        })}

      </div>
    </div>
  );
};