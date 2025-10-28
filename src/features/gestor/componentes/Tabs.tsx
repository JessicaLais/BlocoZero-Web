// components/Tabs.tsx
import  { useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { classMerge } from "../../../utils/classMerge";

interface TabsContextType {
    activeTab: string;
    setActiveTab: (label: string) => void;
}
const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
    children: ReactNode;
    defaultTab: string;
}
export function Tabs({ children, defaultTab }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab);
    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div>{children}</div>
        </TabsContext.Provider>
    );
}

interface TabListProps {
    children: ReactNode;
}
export function TabList({ children }: TabListProps) {
    return (
        <div className="flex flex-row -mb-px"> 
            {children}
        </div>
    );
}

interface TabProps {
    label: string;
    children: ReactNode;
}
export function Tab({ label, children }: TabProps) {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("Tab deve ser usado dentro de um componente Tabs");
    }
    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === label;

    return (
        <button
            type="button" 
            onClick={() => setActiveTab(label)}
            className={classMerge([
                "px-6 py-2 border text-sm font-semibold focus:outline-none",
                isActive
                    ? "border-gray-400 border-b-white bg-gray-350 rounded-t-md text-gray-800 z-10" 
                    : "border-gray-400 text-gray-800 bg-white rounded-t-md hover:bg-gray-300" 
            ])}
        >
            {children}
        </button>
    );
}

interface TabPanelsProps {
    children: ReactNode;
}
export function TabPanels({ children }: TabPanelsProps) {
    return (
        <div className="border border-gray-400 rounded-b-md rounded-tr-md bg-white p-4">
            {children}
        </div>
    );
}

interface TabPanelProps {
    whenActive: string;
    children: ReactNode;
}
export function TabPanel({ whenActive, children }: TabPanelProps) {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("TabPanel deve ser usado dentro de um componente Tabs");
    }
    const { activeTab } = context;

    return activeTab === whenActive ? <div>{children}</div> : null;
}