import mongoose, { mongo } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add a first name'],
        minlength: [3,'First name must be at least 3 characters']
    },
    middleName: {
        type: String,
        // required: true
    },
    lastName: {
        type: String,
        required: [true, 'Please add a last name']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password mush be at least 8 characters'],
        select: false
    },
    loginAttemps: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
    loginOtpAttempts: {
        type: Number,
        default: 0
    },
    loginOtpAttemptsExpire: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otpAttempts: {
        type: Number,
        default: 0
    },
    otpAttemptsExpire: {
        type: Date
    },
    dob: {
        type: Date,
        required: true,
        default: Date.now
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
        minlength: [10, 'Mobile number must be at least 10 characters'],
        maxlength: [10, 'Mobile number must be at most 10 characters']
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
            default: 'image'
        },
        url: {
            type: String,
            required: true,
            default: 'none'
        }
    },
    bio: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male','female','others']
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User_Soc'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User_Soc'
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    resetPassword: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    loginOtp: {
        type: Number
    },
    loginOtpExpire: {
        type: Date
    },
    otp: {
        type: Number
    },
    otpExpire: {
        type: Date
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    updateHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'History'
        }
    ],
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        }
    ],
    story: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Story'
        }
    ],


},{
    timeStamps: true,

});
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateToken = async function() {
    return jwt.sign({id: this._id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRE});
}

const User = mongoose.model('User_Soc',userSchema); // User naam se application(jis naam se collection bnti h) bnegi or User_Soc se database m connection built hoga
export default User