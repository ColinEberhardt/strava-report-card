
const calendarData = JSON.parse(
    document.getElementById("calendar").getAttribute("data-schedule")
);
const cellSize = 10;

const firstDay = new Date(calendarData[0].day).getDay();

const transX = (d, i) =>
    510 - Math.floor((i - firstDay) / 7) * cellSize + cellSize / 2;
const transY = (d, i) =>
    new Date(d.day).getDay() * cellSize + cellSize / 2;

const maxDistance = Math.max.apply(
    null,
    calendarData.map(d => d.distance)
);

const size = d3
    .scaleSqrt()
    .range([0, cellSize / 2])
    .domain([0, maxDistance]);

d3.select("#calendar")
    .selectAll("rect")
    .data(calendarData)
    .enter()
    .append("circle")
    .attr("r", d => size(d.distance))
    .attr(
        "transform",
        (d, i) => `translate(${transX(d, i)}, ${transY(d, i)})`
    )
    .attr("class", d => {
        switch (d.type) {
            case 3: // workout
                return "workout";
            case 2: // long run
                return "long";
            case 1: // race
                return "race";
        }
        return d.runs > 0 ? "regular" : "no-run";
    })
    .append("title")
    .text(d => d.titles.join(", "));

d3.select("#calendar")
    .selectAll("text")
    .data(["S", "M", "T", "W", "T", "F", "S"])
    .enter()
    .append("text")
    .text(d => d)
    .attr("style", "font-size: 8px")
    .attr(
        "transform",
        (_, i) => `translate(0, ${i * cellSize + cellSize / 2})`
    );

const data = JSON.parse(
    document.getElementById("timeOfDay").getAttribute("data-time-of-day")
);

const SEGMENT_RADIUS = (Math.PI * 2) / 24;
const SEGMENT_OFFSET = Math.PI + SEGMENT_RADIUS / 2;

const arc = d3
    .arc()
    .innerRadius(25)
    .outerRadius(d => 25 + d * 70 + 1)
    .startAngle((_, i) => (i - 0.5) * SEGMENT_RADIUS + SEGMENT_OFFSET)
    .endAngle((_, i) => (i + 0.5) * SEGMENT_RADIUS + SEGMENT_OFFSET);

d3.select("#timeOfDay")
    .selectAll("path.time")
    .data(data)
    .enter()
    .append("path")
    .classed("time", true)
    .attr("d", arc);

const arc2 = d3
    .arc()
    .innerRadius(d => (d % 3 === 0 ? 20 : 22))
    .outerRadius(24)
    .startAngle(d => d * SEGMENT_RADIUS - 0.03)
    .endAngle(d => d * SEGMENT_RADIUS + 0.03);

d3.select("#timeOfDay")
    .selectAll("path.indicator")
    .data(d3.range(0, 24))
    .enter()
    .append("path")
    .classed("indicator", true)
    .attr("d", arc2);

const locationData = JSON.parse(
    document.getElementById("map").getAttribute("data-locations")
);

const map = L.map("map", {
    zoomControl: false,
    attributionControl: false,
    trackResize: false,
    boxZoom: false,
    doubleClickZoom: false,
    dragging: false,
    scrollWheelZoom: false
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const dotIcon = L.icon({
    iconUrl: "dot.png",
    iconSize: [8, 8]
});

const group = new L.featureGroup(
    locationData.map(l => L.marker(l, { icon: dotIcon }))
).addTo(map);
map.fitBounds(group.getBounds());

if (map.getZoom() > 6) {
    map.setZoom(6);
}
