export default function formatLatLon(str) {
    const latitude = str.slice(0, 9);
    const longitude = str.slice(9, 19);
    const latDegrees = parseInt(latitude.slice(1, 3));
    const latMinutes = parseInt(latitude.slice(3, 5));
    const latSeconds = parseInt(latitude.slice(5, 7));
    const lonDegrees = parseInt(longitude.slice(1, 4));
    const lonMinutes = parseInt(longitude.slice(4, 6));
    const lonSeconds = parseInt(longitude.slice(6, 8));
    const _lat = (latDegrees + latMinutes / 60 + latSeconds / 3600) *
        (latitude[0] === "S" ? -1 : 1);
    const _lon = (lonDegrees + lonMinutes / 60 + lonSeconds / 3600) *
        (longitude[0] === "W" ? -1 : 1);
    const lat = roundToDecimal(_lat, 6);
    const lon = roundToDecimal(_lon, 6);
    return { lat, lon };
}
function roundToDecimal(number, decimalPlaces) {
    const x = Math.pow(10, decimalPlaces);
    return Math.round(number * x) / x;
}
