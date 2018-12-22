const CronJob = require('cron').CronJob;
const cron = require('node-cron');

const url = 'mongodb://mursaleen:3472072928Mr@ds141654.mlab.com:41654/node';
var mongoose = require('mongoose');
 
var EventSchema = new mongoose.Schema({

		user_id: String,
		notification: String 

});
var Event = mongoose.model('Event', EventSchema);


var UserSchema = new mongoose.Schema({
		username: String,
		lastActivity: Date 
});
var User = mongoose.model('User', EventSchema);


exports.taskScheduler = () => {

	var _this = this;

	console.log('Scheduler Started');

	const generate = new CronJob('*/4 * * * * *', function() {
			
		_this.generateEvents()

	});

	// every 14 minutes
	const fourteen = new CronJob('*/8 * * * * *', function() {
		generate.stop();
		this.stop();
	});

	// every 21 minutes
	const twenty_one = new CronJob('*/11 * * * * *', function() {
		generate.start();
		fourteen.start()
	});

	twenty_one.start();

}


exports.generateEvents = () => {

	mongoose.connect(url,  { useNewUrlParser: true });
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function() {


		console.log('fetching users...')

		User.find().stream().on('data', function(user) {

			// pseudo code starts
			// dont know finding date difference right now

			var notification = ''
			var time_dfference = Date.now - user.lastActivity

			if (time_difference >= 2 && time_difference < 15) {

				switch(time_difference) {
				  case 2:
				    notification = "Time to use the app"
				    break;
				  case 3:
				    notification = "We miss you"
				    break;
			      case 7:
				    notification = "Its time to show you skills, please come back"
				    break;
			      case 14:
				    notification = "Most of the people lose hope after the first week. Don't be one of them"
				    break;
				  default:
				} 

				// pseudo code ends


				var new_event = new Event({ 
					user_id: user._id,
					notification: notification
				});

				new_event.save(function (err, new_event) {
				    if (err) return console.error(err);
				});
			}

		}).on('error', function(err) {
			console.log(err)
		})
		
	});
}






// ///////////////

		// Event.find(function (err, events) {
		//   if (err) return console.error(err);
		//   console.log(events);
		// })

		// User.find({}, {}, function (err, users) {
		//   if (err) return console.error(err);
		//   console.log(users);
		// })