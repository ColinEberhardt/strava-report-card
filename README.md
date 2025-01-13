# Cycling Report Card

Creates a narrative report card from Strava user's cycling data.

 - The service is hosted here, [run-report.com](https://run-report.com/)
 - You can find more details about this via the blog post, [Creating personalised data stories with GPT-3](https://blog.scottlogic.com/2021/12/08/narrative-dashboard.html)

## Development

To run locally:

~~~
npm start
~~~

To deploy:

~~~
npm run deploy
~~~

## TODO 

### features to add
- [x] ride streak
- [x] active days
- [x] geoclustering to provide location commentary
- [x] longest ride
- [x] total distance comparison
- [ ] fastest and slowest rides?
- [x] add tooltips to the calendar view

### infrastructure
- [x] conform to strava branding guidelines https://developers.strava.com/guidelines/
- [x] make index.html default page 
- [ ] start using SASS?
- [ ] stop using the bootstrap 'full' build
- [x] add a social card
- [ ] remove hard-coding of bucket name


### Design ideas ...

 - https://cf.veloviewer.com/blog/Infographic.png
