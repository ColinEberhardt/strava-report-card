const { least, mean } = require("d3-array");

module.exports = stravaData => {
  const popularRide = least(stravaData.rides, d => -d.kudos_count);
  return {
    thirteen: Math.floor(mean(stravaData.rides, d => d.kudos_count)),
    north_tyneside_ten: popularRide.name,
    north_tyneside_ten_id: popularRide.id,
    forty: popularRide.kudos_count,
    followers: stravaData.athlete.follower_count
  };
};
