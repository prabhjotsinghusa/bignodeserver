const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    uid: { type: Number, unique: true, index: true },
    username: { type: String, default: null },
    fullname: { type: String, required: [true, "can't be blank"], trim: true },
    email: { type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], trim: true },
    contact: { type: String, default: null, trim: true },
    password: { type: String, required: [true, "can't be blank"], trim: true },
    role: { type: String, default: 'publisher' },
    login_token: { type: String },
    created_at: { type: Date },
    status: { type: String, default: 'active' },
    price_per_tfn: { type: Number, default: 0 },
    pub_queue: { type: String, default: 'others' },
    isDeleted: { type: Boolean, default: 'false' }
  
  }, { timestamps: true });

UserSchema.plugin(AutoIncrement, { inc_field: 'uid' });

module.exports = mongoose.model('User', UserSchema);
