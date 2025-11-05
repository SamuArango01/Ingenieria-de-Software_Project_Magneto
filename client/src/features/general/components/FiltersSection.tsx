"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import { Filters } from "../types/candidates";

interface Props {
  readonly filters: Filters;
  readonly onFiltersChange: (filters: Filters) => void;
  readonly onClearFilters: () => void;
  readonly isOpen?: boolean;
  readonly onToggle?: () => void;
  readonly onClose?: () => void;
}

const workFields = [
  "Todos",
  "Desarrollo Frontend",
  "Desarrollo Backend", 
  "Full Stack",
  "Mobile Development",
  "DevOps",
  "Data Science",
  "UX/UI Design"
];


function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted && typeof document !== 'undefined' 
    ? createPortal(children, document.body)
    : null;
}

export function FiltersSection({ filters, onFiltersChange, onClearFilters, isOpen, onToggle, onClose }: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });


  const isControlled = isOpen !== undefined;
  const open = isControlled ? isOpen : internalOpen;
  
  const handleToggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalOpen(prev => !prev);
    }
  };

  const handleClose = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalOpen(false);
    }
  };

 
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: Math.min(rect.right + window.scrollX - 320, window.innerWidth - 340)
      });
    }
  }, [open]);

  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const hasActiveFilters = filters.workField !== "Todos" || 
                          filters.minExperience > 0 || 
                          filters.minScore > 0 || 
                          filters.minInterviews > 0;

  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toNumber = (value: string): number => {
    const num = Number(value);
    return Number.isNaN(num) ? 0 : num;
  };

  const activeFilterCount = [
    filters.workField !== "Todos",
    filters.minExperience > 0,
    filters.minScore > 0,
    filters.minInterviews > 0
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    onClearFilters();
    handleClose();
  };

  return (
    <div className="relative">
  
      <div className="flex items-center gap-2">
        <Button 
          ref={buttonRef}
          variant={hasActiveFilters ? "secondary" : "outline"}
          size="sm" 
          onClick={handleToggle}
          className={`border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-200 ${
            hasActiveFilters ? "bg-blue-500/20 border-blue-500/50" : ""
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 bg-blue-600 text-white px-1.5 py-0 min-w-5 h-5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            className="h-9 w-9 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
            title="Limpiar filtros"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      
      {open && (
        <Portal>
          <div 
            ref={panelRef}
            className="fixed bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-2xl z-[9999] w-80"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">Filtros Avanzados</h4>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearFilters}
                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <label htmlFor="workField-filter" className="text-xs font-medium text-gray-300 block">
                    Área de Trabajo
                  </label>
                  <select
                    id="workField-filter"
                    value={filters.workField}
                    onChange={(e) => updateFilter("workField", e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {workFields.map(field => (
                      <option key={field} value={field} className="bg-gray-700">{field}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label htmlFor="minExperience-filter" className="text-xs font-medium text-gray-300 block">
                      Exp. Mínima
                    </label>
                    <select
                      id="minExperience-filter"
                      value={filters.minExperience}
                      onChange={(e) => updateFilter("minExperience", toNumber(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={0}>Cualquiera</option>
                      <option value={1}>1+ años</option>
                      <option value={2}>2+ años</option>
                      <option value={3}>3+ años</option>
                      <option value={5}>5+ años</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="minScore-filter" className="text-xs font-medium text-gray-300 block">
                      Score Mínimo
                    </label>
                    <select
                      id="minScore-filter"
                      value={filters.minScore}
                      onChange={(e) => updateFilter("minScore", toNumber(e.target.value))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={0}>Cualquiera</option>
                      <option value={60}>60%+</option>
                      <option value={70}>70%+</option>
                      <option value={80}>80%+</option>
                      <option value={90}>90%+</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="minInterviews-filter" className="text-xs font-medium text-gray-300 block">
                    Mín. Entrevistas
                  </label>
                  <select
                    id="minInterviews-filter"
                    value={filters.minInterviews}
                    onChange={(e) => updateFilter("minInterviews", toNumber(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={0}>Cualquiera</option>
                    <option value={1}>1+</option>
                    <option value={2}>2+</option>
                    <option value={3}>3+</option>
                    <option value={5}>5+</option>
                  </select>
                </div>
              </div>

            
              {hasActiveFilters && (
                <div className="pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-2">Filtros aplicados:</p>
                  <div className="flex flex-wrap gap-1">
                    {filters.workField !== "Todos" && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                        {filters.workField}
                      </Badge>
                    )}
                    {filters.minExperience > 0 && (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                        Exp: {filters.minExperience}+
                      </Badge>
                    )}
                    {filters.minScore > 0 && (
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                        Score: {filters.minScore}%+
                      </Badge>
                    )}
                    {filters.minInterviews > 0 && (
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                        Entrevistas: {filters.minInterviews}+
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}