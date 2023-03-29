import * as fs from "fs";
import formatLatLon from "./lib/formatLatLon.js";
const fileContent = fs.readFileSync("./data/FAACIFP18.txt", "utf8");

// const facilityIdsToNames = {
//     A: "Airport",
//     B: "Beacon",
//     C: "Communications facility",
//     D: "DME (distance measuring equipment)",
//     E: "VOR/DME",
//     F: "Fan marker",
//     G: "Glideslope transmitter",
//     H: "Holding pattern",
//     I: "ILS (instrument landing system)",
//     J: "NDB (non-directional beacon)",
//     K: "VOR",
//     L: "Localizer",
//     M: "Marker beacon",
//     N: "NDB/DME",
//     O: "Outer marker",
//     P: "Precision approach radar",
//     Q: "TACAN (tactical air navigation)",
//     R: "Radar",
//     S: "SDF (simplified directional facility)",
//     T: "TACAN/DME",
//     U: "UHF omnidirectional range",
//     V: "VHF omnidirectional range",
//     W: "Waypoint",
//     X: "Transmitter",
//     Y: "RNAV (area navigation) waypoint",
//     Z: "RNAV (precision) waypoint",
// };

const files = fileContent.split("\n");
type AirportData = {
    recordId: string;
    id: string;
    name: string;
    location: string;
    longitude: number;
    latitude: number;
    magneticVar: string;
    recordExt: string;
    hours: string;
};

type EnrouteWaypoint = {
    recordId: string;
    id: string;
    facilityId: string;
    waypointType: string;
    magneticVar: string;
    location: string;
    latitude: number;
    longitude: number;
    magneticCourse: string;
    regionId: string;
    name: string;
    recordExt: string;
};

// let EnrouteWaypoint = {
//     recordId: "",
//     id: "",
//     facilityId: "",
//     waypointType: "",
//     magneticVar: "",
//     location: "",
//     latitude: 0,
//     longitude: 0,
//     magneticCourse: "",
//     regionId: "",
//     name: "",
//     recordExt: "",
// };

const getFileSection = function (
    files: string[],
    section: string,
    zone?: string
) {
    const fileSection: string[] = [];
    for (let file of files) {
        if (file.split(" ")[0] === section) fileSection.push(file);
    }
    return fileSection;
};
// const getFileZones = function (
//     files: string[],
//     section: string,
//     zone?: string
// ) {
//     const fileSection: string[] = [];
//     for (let file of files) {
//         if (file.split(" ")[0] === section && file.slice(10, 12) === zone)
//             fileSection.push(file);
//     }
//     return fileSection;
// };

console.log(files);

const getEnrouteWaypoints = function (rows: string[]) {
    const wpts: object[] = [];
    for (let row of rows) {
        if (row.split(" ")[0] === "SUSAEAENRT") {
            // let csvString = "";
            let wpt = {} as EnrouteWaypoint;
            wpt.recordId = row.slice(0, 10).trim();
            wpt.id = row.slice(13, 19).trim();
            wpt.facilityId = row.slice(19, 23).trim();
            wpt.waypointType = row.slice(26, 27).trim();
            wpt.magneticVar = row.slice(30, 31).trim();
            wpt.location = row.slice(32, 51).trim();
            let { lat, lon } = formatLatLon(wpt.location);
            wpt.longitude = lon;
            wpt.latitude = lat;
            wpt.magneticCourse = row.slice(73, 79).trim();
            wpt.regionId = row.slice(83, 87).trim();
            wpt.name = row.slice(97, 107).trim();
            wpt.recordExt = row.slice(123, 132).trim();
            // csvString += `${wpt.recordId},${wpt.id},${wpt.facilityId},${wpt.magneticVar},${wpt.location},${wpt.latitude},${wpt.longitude},${wpt.magneticCourse},${wpt.regionId},${wpt.name},${wpt.recordExt}\n`;
            wpts.push(wpt);
        }
    }
    return wpts;
};

const getAirports = function (rows: string[], region?: string) {
    const airports: AirportData[] = [];

    for (let row of rows) {
        if (
            row.split(" ")[0] === "SUSAP" &&
            row.charAt(12) === "A" &&
            row.slice(10, 12) === region
        ) {
            // const newRow = row.replaceAll(" ", ",");
            let airport = {} as AirportData;
            airport.id = row.slice(6, 10);
            airport.recordId = row.slice(0, 5);
            airport.location = row.slice(32, 51).trim();
            let { lat, lon } = formatLatLon(airport.location);
            airport.latitude = lat;
            airport.longitude = lon;
            airport.magneticVar = row.slice(52, 61).trim();
            airport.name = row.slice(93, 123).trim();
            airport.recordExt = row.slice(123, 132).trim();
            airport.hours = row.slice(70, 81).trim();
            airports.push(airport);
        }
    }

    return airports;
};

// const airportResults = getAirports(files, "K7");
// const enrouteWaypointResults = getEnrouteWaypoints(files);
const waypointFiles = getFileSection(files, "SUSAEAENRT");
const airportFiles = getFileSection(files, "SUSAP");
const airwayFiles = getFileSection(files, "SUSAER");
const scanEr = getFileSection(files, "SCANER");
const scanEAEnroute = getFileSection(files, "SCANEAENRT");
const arrivals = getFileSection(files, "SCANP");

// console.log(airportResults[500]);

fs.writeFileSync("sections/airports.txt", airportFiles.join("\n"));
fs.writeFileSync("sections/waypoints.txt", waypointFiles.join("\n"));
fs.writeFileSync("sections/airways.txt", airwayFiles.join("\n"));
fs.writeFileSync("sections/scanEr.txt", scanEr.join("\n"));
fs.writeFileSync("sections/scanEAEnroute.txt", scanEAEnroute.join("\n"));
fs.writeFileSync("sections/arrivals.txt", arrivals.join("\n"));

console.log(
    waypointFiles.length,
    airportFiles.length,
    airwayFiles.length,
    scanEr.length,
    scanEAEnroute.length,
    arrivals.length
);

// async function getAirports(airncFile: string[], section: string = "SUSAP") {
//     const airports: AirportData[] = [];
//     for (let row of airncFile) {
//         if (row.split(" ")[0] === section && row.charAt(12) === "A") {
//             // let csvString = "";
//             let airport = {} as AirportData;
//             airport.id = row.slice(6, 10);
//             airport.recordId = row.slice(0, 5);
//             airport.location = row.slice(32, 51).trim();
//             let { lat, lon } = formatLatLon(airport.location);
//             airport.latitude = lat;
//             airport.longitude = lon;
//             airport.magneticVar = row.slice(52, 61).trim();
//             airport.name = row.slice(93, 123).trim();
//             airport.recordExt = row.slice(123, 132).trim();
//             airport.hours = row.slice(70, 81).trim();
//             airports.push(airport);
//         }
//         return airports;
//     }
//     return [];
// }

// const results = await getAirports(rows);

// if (results) console.log(results.length);

// function selectAirport(id: string) {
//     const selected = airports.find((apt) => apt.id === id);
//     console.log(selected);
// }

// for (let row of rows) {
//     if (row.split(" ")[0] === `SUSAEAENRT`) {
//         // let csvString = "";
//         let wpt = {} as EnrouteWaypoint;
//         wpt.recordId = row.slice(0, 10).trim();
//         wpt.id = row.slice(13, 19).trim();
//         wpt.facilityId = row.slice(19, 23).trim();
//         wpt.waypointType = row.slice(26, 27).trim();
//         wpt.magneticVar = row.slice(30, 31).trim();
//         wpt.location = row.slice(32, 51).trim();
//         let { lat, lon } = formatLatLon(wpt.location);
//         wpt.longitude = lon;
//         wpt.latitude = lat;
//         wpt.magneticCourse = row.slice(73, 79).trim();
//         wpt.regionId = row.slice(83, 87).trim();
//         wpt.name = row.slice(97, 107).trim();
//         wpt.recordExt = row.slice(123, 132).trim();
//         // csvString += `${wpt.recordId},${wpt.id},${wpt.facilityId},${wpt.magneticVar},${wpt.location},${wpt.latitude},${wpt.longitude},${wpt.magneticCourse},${wpt.regionId},${wpt.name},${wpt.recordExt}\n`;
//         wpts.push(wpt);
//     }
