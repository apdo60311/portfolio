import { ReactNode } from "react";

export interface StatsCardProps {
    title: string;
    value: string;
    icon: ReactNode;
    description?: string;
    className?: string;
}