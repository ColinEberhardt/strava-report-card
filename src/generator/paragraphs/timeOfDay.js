const { bucket } = require("./util/util");

const timeOfDayVectorGenerator = data =>
  bucket(
    data,
    d => d.distance,
    d => d.startDate.toUTC().hour,
    24
  );

module.exports = stravaData => {
  const yearOfCyclingData = stravaData.activities;
  const timeOfDay = timeOfDayVectorGenerator(yearOfCyclingData);
  const max = Math.max(...timeOfDay);
  return timeOfDay.map(s => s / max);
};
