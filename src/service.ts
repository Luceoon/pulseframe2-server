import { db } from "./db.server";
import { Anim, AnimData } from "./model";
import crypto from "crypto";
import fs from "fs";

export interface Error {
    code: number;
    message: string;
}

export interface ServiceResponse<T> {
    result: T | null;
    err: Error;
}

export async function getChecksum(): Promise<ServiceResponse<string>> {
    let anims = await getPlaylist();

    if (anims.err.code != 200) {
        return {
            result: null,
            err: anims.err,
        };
    }

    const hash = crypto.createHash("sha256");
    hash.update(JSON.stringify(anims.result));
    const checksum = hash.digest("base64");

    return {
        result: checksum,
        err: {
            code: 200,
            message: "OK",
        },
    };
}

export async function validate(name: string): Promise<boolean> {
    
    const anim = await db.anim.findUnique({ where: { name: name } });
    if (!anim) {
        return true;
    }

    return false;
}

export async function createAnim(
    data: AnimData
): Promise<ServiceResponse<Anim>> {
    console.log("Creating new anim: ", data);
    let anim = await db.anim.create({
        data: {
            filename: data.filename,
            name: data.name,
            active: data.active,
            duration: data.duration,
            loop: data.loop,
        },
    });

    if (!anim) {
        console.log("Failed saving animation");
        return {
            result: null,
            err: {
                code: 500,
                message: "Internal server error",
            },
        };
    }

    console.log("Animation saved");
    return {
        result: anim,
        err: {
            code: 200,
            message: "OK",
        },
    };
}

export async function getAnim(id: number): Promise<ServiceResponse<Anim>> {
    console.log("Request getting animation with id: ", id);
    let anim = await db.anim.findUnique({
        where: {
            id: id,
        },
    });

    if (!anim) {
        console.log("Failed getting animation");
        return {
            result: null,
            err: {
                code: 404,
                message: "Not found",
            },
        };
    }

    return {
        result: anim,
        err: {
            code: 200,
            message: "OK",
        },
    };
}

export async function getAllAnims(): Promise<ServiceResponse<Anim[]>> {
    console.log("Request getting all animations");
    let anims = await db.anim.findMany();

    if (!anims) {
        console.log("Failed");
        return {
            result: null,
            err: {
                code: 500,
                message: "Internal server error",
            },
        };
    }

    return {
        result: anims,
        err: {
            code: 200,
            message: "OK",
        },
    };
}

export async function deleteAnim(id: number): Promise<ServiceResponse<Anim>> {
    console.log("Deleting anim with id: ", id);

    let anim = await db.anim.delete({ where: { id: id } });

    if (!anim) {
        console.log("Failed deleting animation");
        return {
            result: null,
            err: {
                code: 404,
                message: "Not found",
            },
        };
    }

    const filePath = `../data/files/${anim.filename}`;

    await fs.rm(filePath, (err) => {
        if (err) {
            console.log("Failed deleting file");
            return {
                result: null,
                err: {
                    code: 500,
                    message: "Internal server error - Failed to remove animation file from server",
                },
            };
        }
    });

    console.log("Animation deleted");
    return {
        result: anim,
        err: {
            code: 200,
            message: "OK",
        },
    };
}

export async function updateAnim(
    id: number,
    data: AnimData
): Promise<ServiceResponse<Anim>> {
    console.log("Updating anim with id: ", id);
    let anim = await db.anim.update({
        where: {
            id: id,
        },
        data: {
            name: data.name,
            active: data.active,
            duration: data.duration,
            loop: data.loop,
        },
    });

    if (!anim) {
        console.log("Failed updating animation");
        return {
            result: null,
            err: {
                code: 404,
                message: "Not found",
            },
        };
    }

    console.log("Animation updated");
    return {
        result: anim,
        err: {
            code: 200,
            message: "OK",
        },
    };
}

export async function getPlaylist(): Promise<ServiceResponse<Anim[]>> {
    let playlist = await db.anim.findMany({ where: { active: true } });

    if (!playlist) {
        return {
            result: null,
            err: {
                code: 500,
                message: "Internal server error",
            },
        };
    }

    return {
        result: playlist,
        err: {
            code: 200,
            message: "OK",
        },
    };
}
