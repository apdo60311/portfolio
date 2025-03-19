export interface AboutContent {
    id: string;
    section_name: string;
    title: string;
    content: any;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface TimelineEntry {
    title: string;
    company: string;
    period: string;
    description: string;
    icon: React.ReactNode;
}

export interface SkillCategory {
    title: string;
    icon: React.ReactNode;
    skills: string[];
}
