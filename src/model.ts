export type Anim = {
    id: number;
    name: string;
    filename: string;
    created_at: Date;
    updated_at: Date;
};

export type PlaylistItem = {
    id: number;
    anim_id: number;
    duration: number;
    loop: boolean;
};

export type Playlist = {
    id: number;
    name: string;
    items: PlaylistItem[];
};