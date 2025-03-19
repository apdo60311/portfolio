export type ProjectType = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    link: string;
    challenge?: string;
    solution?: string;
    github_url?: string;
    demo_url?: string;
    code_snippet?: string;
    code_language?: string;
    featured: boolean;
    created_at?: string;
    status: 'working' | 'under_development' | 'completed';
    image_url?: string;
};
