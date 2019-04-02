const Settings = require('../models/adminsettings');
const Pagesadmin = require('../models/adminpage');
const HomeSettings = require('../models/homesettings');
var multer = require('multer');
var path = require("path");

var storage = multer.diskStorage({
	destination: "./public/uploads/",
	filename: function (req, file, cb) {
		cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
	}
});
var upload = multer({ //multer settings
	storage: storage
}).single('logo');

var upload_function = multer({ //multer settings
	storage: storage
}).single('banner');

var upload_featured = multer({ //multer settings
	storage: storage
}).single('featured');

var upload_bottomimage= multer({ //multer settings
	storage: storage
}).single('bottomimage');


//var config =require ("../config/main")

//= =======================================
// Settings Routes
//= =======================================
exports.FetchSettings = function (req, res, next) {
	var bind = {};

	Settings.find(function (err, settingsData) {
		console.log(settingsData);
		if (err) {
			bind.status = 0;
			bind.message = 'Oops! Error occured while fetching information';
			bind.error = err;
			return res.json(bind);

		} else {
			bind.status = 1;
			bind.message = 'Success';
			bind.settings = settingsData;
			return res.json(bind);

		}


	})
}

exports.SaveSettings = function (req, res, next) {
	var bind = {};
	//console.log(req.body);
	const header = req.body.header;
	const sub_header = req.body.sub_header;
	const copyright = req.body.copyright;
	const facebook = req.body.facebook;
	const instagram = req.body.instagram;
	const linkedin = req.body.linkedin;
	const twitter = req.body.twitter;
	const youtube = req.body.youtube;

	const settings = new Settings({
		header,
		sub_header,
		copyright,
		facebook,
		instagram,
		linkedin,
		twitter,
		youtube
	});
	Settings.findOne({}, (err, existSettings) => {
		if (existSettings) {

			Settings.updateMany({
					"_id": existSettings._id
				}, {
					"$set": {
						"header": header,
						"sub_header": sub_header,
						"copyright": copyright,
						"facebook": facebook,
						"instagram": instagram,
						'linkedin': linkedin,
						"twitter": twitter,
						"youtube": youtube
					}
				})
				.then(result => {
					if (result) {
						Settings.find(function (err, existSettings) {
							//console.log(existSettings);
							if (err) {
								bind.status = 0;
								bind.message = 'Oops! Error occured while fetching information';
								bind.error = err;
								return res.json(bind);

							} else {
								bind.status = 1;
								bind.message = 'Settings Updated successfully !';
								bind.settings = existSettings;
								return res.json(bind);

							}


						})
					} else {
						bind.status = 0;
						bind.message = 'Oops! Error occured while fetching information';
						bind.error = err;
						return res.json(bind);
					}
				});
		} else if (err) {
			bind.status = 0;
			bind.message = 'Oops! Error occured while fetching information';
			bind.error = err;
			return res.json(bind);
		} else {
			settings.save((err, settings) => {
				if (err) {
					bind.status = 0;
					bind.message = 'Oops! Error occured while fetching information';
					bind.error = err;
					return res.json(bind);
				} else {
					bind.status = 1;
					bind.message = 'Settings saved successfully !';
					bind.settings = settings;
					return res.json(bind);
				}

			});
		}

	});
}
exports.SaveLogo = function (req, res, next) {
	upload(req, res, (err) => {
		console.log("Request file ---", req.file.filename); //Here you get file.
		/*Now do where ever you want to do*/
		if (!err) {
			var bind = {};
			//console.log(req.body);
			const logo = req.file.filename;

			const logoSettings = new Settings({
				logo
			});
			Settings.findOne({}, (err, existSettings) => {
				if (existSettings) {

					Settings.updateMany({
							"_id": existSettings._id
						}, {
							"$set": {
								"logo": logo
							}
						})
						.then(result => {
							if (result) {
								bind.status = 1;
								bind.message = 'Logo updated successfully !';
								bind.settings = existSettings;
								return res.json(bind);
							} else {
								bind.status = 0;
								bind.message = 'Oops! Error occured while updating logo';
								bind.error = err;
								return res.json(bind);
							}
						});
				} else if (err) {
					bind.status = 0;
					bind.message = 'Oops! Error occured while updating logo';
					bind.error = err;
					return res.json(bind);
				} else {
					settings.save((err, logoSettings) => {
						if (err) {
							bind.status = 0;
							bind.message = 'Oops! Error occured while updating logo';
							bind.error = err;
							return res.json(bind);
						} else {
							bind.status = 1;
							bind.message = 'Logo updated successfully !';
							bind.settings = settings;
							return res.json(bind);
						}

					});
				}

			});
		} else {
			bind.status = 0;
			bind.message = 'Oops! Error occured while updating logo';
			bind.error = err;
			return res.json(bind);
		}
		//   return res.sendStatus(200).end();
	});
}

exports.SaveBanner = function (req, res, next) {
	upload_function(req, res, (err) => {
		console.log("Request file ---", req.file); //Here you get file.
		/*Now do where ever you want to do*/
		if (!err) {
			var bind = {};
			console.log(req.file.filename);
			const header_banner = req.file.filename;

			const bannerSettings = new Settings({
				header_banner
			});
			Settings.findOne({}, (err, existSettings) => {
				if (existSettings) {

					Settings.updateMany({
							"_id": existSettings._id
						}, {
							"$set": {
								"header_banner": header_banner
							}
						})
						.then(result => {
							if (result) {
								bind.status = 1;
								bind.message = 'Banner saved successfully !';
								bind.settings = existSettings;
								return res.json(bind);
							} else {
								bind.status = 0;
								bind.message = 'Oops! Error occured while updating Banner !';
								bind.error = err;
								return res.json(bind);
							}
						});
				} else if (err) {
					bind.status = 0;
					bind.message = 'Oops! Error occured while updating Banner !';
					bind.error = err;
					return res.json(bind);
				} else {
					settings.save((err, bannerSettings) => {
						if (err) {
							bind.status = 0;
							bind.message = 'Oops! Error occured while updating Banner !';
							bind.error = err;
							return res.json(bind);
						} else {
							bind.status = 1;
							bind.message = 'Banner saved successfully !';
							bind.settings = settings;
							return res.json(bind);
						}

					});
				}

			});
		} else {
			bind.status = 0;
			bind.message = 'Oops! Error occured while updating logo';
			bind.error = err;
			return res.json(bind);
		}
		//   return res.sendStatus(200).end();
	});
}

exports.savePage = function (req, res, next) {
	upload_featured(req, res, (err) => {
		console.log("Request file ---", req.file); //Here you get file.
		// /*Now do where ever you want to do*/
		if (!err) {
			var bind = {};
			if(req.file == undefined){
				bind.status = 0;
				bind.message = 'Please select Featured image!';
				return res.json(bind);
			}
			//console.log(req.body);
			const featured = req.file.filename;
			const title = req.body.title;
			const content = req.body.content;
		    const slug = req.body.slug;

			const pagedata = new Pagesadmin({
				featured,
				title,
				content,
				slug
			});

			pagedata.save((err, pagedata) => {
				if (err) {
					bind.status = 0;
					bind.message = 'Oops! Error occured while saving page !';
					bind.error = err;
					return res.json(bind);
				} else {
					bind.status = 1;
					bind.message = 'Page saved successfully !';
					bind.settings = pagedata;
					return res.json(bind);
				}

			});
		} else {
			bind.status = 0;
			bind.message = 'Oops! Error occured saving page !';
			bind.error = err;
			return res.json(bind);
		}
		//   return res.sendStatus(200).end();
	});
}


exports.saveHomesettings = function (req, res, next) {
	upload_bottomimage(req, res, (err) => {
		console.log("Request file ---", req.file); //Here you get file.
		// /*Now do where ever you want to do*/
		if (!err) {
			var bind = {};
			if(req.file == undefined){
				bind.status = 0;
				bind.message = 'Oops! Error occured while saving settings !';
				return res.json(bind);
			}
			//console.log(req.body);
			const bottomimage = req.file.filename;
			const app_store = req.body.app_store;
			const content = req.body.content;
			const content1 = req.body.content1;
			const content2 = req.body.content2;
			const content3 = req.body.content3;
		    const google_play = req.body.google_play;

			const homedata = new HomeSettings({
				bottomimage,
				app_store,
				content,
				content1,
				content2,
				content3,
				google_play
			});

			HomeSettings.findOne({}, (err, homedata) => {
				if (homedata) {
		
					HomeSettings.updateMany({
							"_id": homedata._id
						}, {
							"$set": {
							"bottomimage": bottomimage,
							"app_store": app_store,
							"content": content,
							"content1": content1,
							"content2": content2,
							'content3': content3,
							"google_play": google_play
							
							}
						})
						.then(result => {
							if (result) {
								HomeSettings.find(function (err, homedata) {
									//console.log(existSettings);
									if (err) {
										bind.status = 0;
										bind.message = 'Oops! Error occured while fetching information';
										bind.error = err;
										return res.json(bind);
		
									} else {
										bind.status = 1;
										bind.message = 'Settings Updated successfully !';
										bind.settings = homedata;
										return res.json(bind);
		
									}
		
		
								})
							} else {
								bind.status = 0;
								bind.message = 'Oops! Error occured while fetching information';
								bind.error = err;
								return res.json(bind);
							}
						});
				} else if (err) {
					bind.status = 0;
					bind.message = 'Oops! Error occured while fetching information';
					bind.error = err;
					return res.json(bind);
				} else {
					homedata.save((err, homedata) => {
						if (err) {
							bind.status = 0;
							bind.message = 'Oops! Error occured while fetching information';
							bind.error = err;
							return res.json(bind);
						} else {
							bind.status = 1;
							bind.message = 'Settings saved successfully !';
							bind.settings = homedata;
							return res.json(bind);
						}
		
					});
				}
		
			});
		//   return res.sendStatus(200).end();
	};
});
}
exports.gethomepagesettings = function (req, res, next) {
	var bind = {};

	HomeSettings.find(function (err, settingsData) {
		console.log(settingsData);
		if (err) {
			bind.status = 0;
			bind.message = 'Oops! Error occured while fetching information';
			bind.error = err;
			return res.json(bind);

		} else {
			bind.status = 1;
			bind.message = 'Success';
			bind.settings = settingsData;
			return res.json(bind);

		}


	})
}

exports.getPages = function (req, res, next) {
	var bind = {};

	Pagesadmin.find(function (err, pagesData) {
		console.log(pagesData);
		if (err) {
			bind.status = 0;
			bind.message = 'Oops! Error occured while fetching information';
			bind.error = err;
			return res.json(bind);

		} else {
			bind.status = 1;
			bind.message = 'Success';
			bind.settings = pagesData;
			return res.json(bind);

		}


	})
}