
import { join } from "https://deno.land/std@0.67.0/path/mod.ts";
import { BufReader } from "https://deno.land/std@0.67.0/io/bufio.ts";
import { parse } from "https://deno.land/std@0.67.0/encoding/csv.ts";

import * as _ from "https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/lodash.js";

interface Planet {
    [ key : string ] : string
};

async function loadPlanetsData() {
    
    const path = join(".", "kepler-exoplanets_nasa.csv");

    const file = await Deno.open(path);
    const bufReader = new BufReader(file);
    const result = await parse(bufReader, {
        header: true,
        comment: "#"
    });

    Deno.close(file.rid);

    const planets = (result as Array<Planet>).filter((planet) => {
        const planetaryRadius = Number(planet["koi_prad"]);
        // const stellarMass = planet["koi_smass"]; koi_smassがcsvの項目にない。
        const stellarRadius = Number(planet["koi_srad"]);

        return planet["koi_disposition"] === "CONFIRMED"
        && planetaryRadius > 0.5 && planetaryRadius < 1.5
        && stellarRadius > 0.99 && stellarRadius < 1.01;

    });

    return planets.map((planet) => {
        return _.pick(planet, [
            'koi_prad',
            'koi_srad',
            'kepler_name',
            'koi_steff'
        ]);
    });

}

const newEarths = await loadPlanetsData();
for (const planet of newEarths) {
    console.log(planet);
}
console.log(`${newEarths.length} habitable planets found!`);