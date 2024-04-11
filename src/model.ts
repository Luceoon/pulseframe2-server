export interface AnimData {
    name: string;
    filename: string;
    active: boolean;
    duration: number;
    loop: boolean;
}

export interface Anim extends AnimData {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}