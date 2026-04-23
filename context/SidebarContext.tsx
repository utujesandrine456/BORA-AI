'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
    isCollapsed: boolean;
    isMobileMenuOpen: boolean;
    toggleSidebar: () => void;
    toggleMobileMenu: () => void;
    setIsCollapsed: (value: boolean) => void;
    setIsMobileMenuOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

    // Load preference from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('sidebar_collapsed');
        if (stored === 'true') {
            setIsCollapsed(true);
        }
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(prev => {
            const newValue = !prev;
            localStorage.setItem('sidebar_collapsed', String(newValue));
            return newValue;
        });
    };

    return (
        <SidebarContext.Provider value={{
            isCollapsed,
            isMobileMenuOpen,
            toggleSidebar,
            toggleMobileMenu,
            setIsCollapsed,
            setIsMobileMenuOpen
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
