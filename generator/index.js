const fs = require("fs");
const Handlebars = require("handlebars");
const { DateTime, Interval } = require("luxon");

const yearInReview = require("./paragraphs/yearInReview");
const trainingPattern = require("./paragraphs/trainingPattern");
const oneLiner = require("./paragraphs/oneLiner");
const schedule = require("./paragraphs/schedule");
const timeOfDay = require("./paragraphs/timeOfDay");
const kudos = require("./paragraphs/kudos");
const gallery = require("./paragraphs/gallery");

const METRES_TO_MILES = 0.000621371;

module.exports = stravaData => {
  // perform some simple data transformations and enrichment
  stravaData.runs.forEach(d => {
    d.startDate = DateTime.fromISO(d.start_date_local);
    d.distance = d.distance * METRES_TO_MILES;
    d.pace = d.distance / d.elapsed_time;
  });
  stravaData.athlete.thirdPersonPronoun =
    stravaData.athlete.sex === "M" ? "he" : "she";
  stravaData.athlete.thirdPersonPossessivePronoun =
    stravaData.athlete.sex === "M" ? "his" : "her";

  // ensure we only use the past year of data
  const generationTime = DateTime.fromISO(stravaData.generation_time);
  stravaData.runs = stravaData.runs
    .filter(
      d =>
        Interval.fromDateTimes(d.startDate, generationTime).length("years") <
        1.0
    )
    .filter(d => d.type === "Run");

  // replace the default avatar
  const profilePic =
    stravaData.athlete.profile === "avatar/athlete/large.png"
      ? "https://d3nn82uaxijpm6.cloudfront.net/assets/avatar/athlete/large.png"
      : stravaData.athlete.profile;

  

  // generate the various report snippets
  const reportData = {
    Colin: stravaData.athlete.firstname.trim(),
    Eberhardt: stravaData.athlete.lastname.trim(),
    his: stravaData.athlete.thirdPersonPossessivePronoun,
    he: stravaData.athlete.thirdPersonPronoun,
    profile_pic: profilePic,
    ...trainingPattern(stravaData),
    ...yearInReview(stravaData),
    ...oneLiner(stravaData),
    annual_schedule: JSON.stringify(schedule(stravaData)),
    time_of_day: JSON.stringify(timeOfDay(stravaData)),
    ...kudos(stravaData),
    ...gallery(stravaData)
  };

  Handlebars.registerHelper(
    "caps",
    text => text.charAt(0).toUpperCase() + text.slice(1)
  );

  const report = String(fs.readFileSync("./generator/report.html"));
  const template = Handlebars.compile(report);
  return template(reportData);
};
