const { DateTime } = require("luxon");
const { range, quantile } = require("d3-array");

const sameDay = (d1, d2) =>
  d1.year === d2.year && d1.month === d2.month && d1.day === d2.day;

module.exports = stravaData => {
  const upperDistanceQuantile = quantile(
    stravaData.rides.map(d => d.distance).sort((a, b) => a - b),
    0.85
  );
  const upperPaceQuantile = quantile(
    stravaData.rides.map(d => d.pace).sort((a, b) => a - b),
    0.85
  );
  const rideType = ride => {
    if (ride.distance > upperDistanceQuantile) {
      return 2; // long
    }
    if (ride.pace > upperPaceQuantile) {
      return 3; // workout
    }
    return 0;
  };

  const activityType = rides => Math.max(...rides.map(rideType));

  const now = DateTime.fromISO(stravaData.generation_time);
  return (
    range(0, 365)
      // create a year of days
      .map(days => now.minus({ days: days }))
      .map(day => {
        // find the rides on that day
        const rides = stravaData.rides.filter(d =>
          sameDay(day, DateTime.fromISO(d.start_date_local))
        );
        return {
          day,
          rides: rides.length,
          type: rides.length > 0 ? activityType(rides) : 0,
          titles: rides.map(r => r.name),
          distance: rides.reduce((prev, curr) => prev + curr.distance, 0)
        };
      })
  );
};
