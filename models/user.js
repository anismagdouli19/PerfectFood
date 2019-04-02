const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;


//Create a schema 
const UserSchema = new Schema({
  email: { type: String, lowercase: true, unique: true, required: true,default:'' },
  password: { type: String,  default:'' },
 
  status: {type: Boolean, default: true},
  enableAccount : {type: Boolean, default: true},
 
  role: {type: Number, default:1, enum: [1,2,3,4]},
  resetPasswordToken: { type: String, default:''},
  resetPasswordExpires: { type: Date, default:'' },
  language: { type: String, default:'en', enum: ['en','fr','pt','es','nl']},
  deviceToken: { type: String, default:''},
  deviceType: { type: String, default:'',  enum: ['ios','android','']}
},
  {
    timestamps: true
  });

UserSchema.pre('save', async function(next){
	try{
		//Generate a salt
    if(this.password == '' || this.password == null){
      this.password = '';
      next();
    }else{
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(this.password, salt);
      this.password = passwordHash;
      next();
    }
	}catch(error){
		next(error);
	}
});

// Method to compare password for login
UserSchema.methods.isValidPassword = async function(newPassword){
	try{
     return await bcrypt.compare(newPassword, this.password);
	}catch(error){
		throw new Error(error)
	}
}

//Create a model
const user =  mongoose.model('user', UserSchema);

//Export the model
module.exports = user;