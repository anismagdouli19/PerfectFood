 var FCM = require('fcm-node');
 var serverKey = 'AAAATi3ExHg:APA91bFUGyBaiLfsXy3xBF-l63vk9OKQMwrtpbkzLy_faqvRLYTWeTqACklCF7NyCA-BTuzxu2VS__K-EZy5GU2H2QVx0H6owRkI0rE-icWY6Sm2e9lxUNh--vwYYVqcnKZ81qE0_4o6'; //put your server key here
 
const User = require('../models/user');
// Express Mailer
var Mailer = require('express-mailer');

//Mail send 
var app1 = require('express')(),
    mailer = require('express-mailer');

mailer.extend(app1, {
	emailFrom: "iostest273@gmail.com",
 	host: 'smtp.gmail.com', // hostname
 	secureConnection: true, // use SSL
 	port: 465, // port for secure SMTP
 	transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
	auth: {
	  	user: 'iostest273@gmail.com',
		pass: '273iostest'
	}
});


module.exports = {

// Push Notification to Android and Ios
	notification: async (data, user_id)=>{
		User.findOne({'_id': user_id}, function(err, user){
			if(err){
				res.json({
					success: false,
					message: language(lang, "commonForAll", "error")
				});
			}else if(user == ''|| user == null){
					 console.log("Something has gone wrong!");
			}else{
				//console.log(user);
				if(user.deviceType == "ios"){			
					return "Something is wrong";
				}else if(user.deviceType == "android") {
					console.log("yes");
					var fcm = new FCM(serverKey);
				    var userToken = user.deviceToken;	// Put token here which user you have to send push notification
				   console.log(userToken);
				    var message = {	//	This may vary according to the message type (single recipient, multicast, topic, et cetera)
				        to: userToken, 
				    	notification: {
				            title: data['title'],
				            body:{
				            	data: data
				            }
				        }, 
					};
				  
				    fcm.send(message, function(err, response){
				        if (err) {
				            console.log("Something has gone wrong!");
				        } else { 
				            console.log("Successfully sent with response: ", response);
				        }
				    });
				}else{
					return "Something has gone wrong!";
				}
			}		
		});	
	},

// Send Email to User 
	send_email: async (template,mailOptions,callback)=>{
		console.log(mailOptions);
		app1.mailer.send(template, mailOptions, function (err, message) {
	        if (err) {
	            console.log(err);
	            return;
	        }
	        console.log(message);
	        return;
	    });
	}
}