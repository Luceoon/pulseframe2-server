import { db } from "../src/db.server";
import type { AnimData } from "../src/model";


async function seed()
{
    let anims: AnimData[] = [
        { name: 'Blobbo', filename: 'led_matrices_blobbo.gif', active: true, duration: 5, loop: true},
        { name: 'Firework', filename: 'led_matrices_firework.gif', active: true, duration: 5, loop: true },
        { name: 'Hop', filename: 'led_matrices_hop.gif', active: false, duration: 5, loop: true },
        { name: 'Ruby Walk', filename: 'led_matrices_ruby_walk.gif', active: true, duration: 5, loop: true },
        { name: 'Sine Tube', filename: 'led_matrices_sine_tube.gif', active: true, duration: 5, loop: true },
    ];

    for (let anim of anims)
    {
        await db.anim.create({
            data: {
                name: anim.name,
                filename: anim.filename,
                active: anim.active,
                duration: anim.duration,
                loop: anim.loop
            }
        });
    }
}

await seed();