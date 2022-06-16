// Calculate intersection of two lines
const line1 = [
    {
        x: 5,
        y: 10
    },
    {
        x: 10,
        y: 20
    }
];
const line2 = [
    {
        x: 5,
        y: 15
    },
    {
        x: 10,
        y: 10
    }
];

const line1M = (line1[1].y - line1[0].y) / (line1[1].x - line1[0].x);
const line2M = (line2[1].y - line2[0].y) / (line2[1].x - line2[0].x);

const line1B = line1[0].y - (line1M * line1[0].x);
const line2B = line2[0].y - (line2M * line2[0].x);

const x = (line2B - line1B) / (line1M - line2M);
const y = line1M * x;
console.log({ x, y });