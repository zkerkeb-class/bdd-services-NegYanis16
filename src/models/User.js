const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required() {
      return !this.googleId;
    },
    trim: true,
  },
  prenom: {
    type: String,
    required() {
      return !this.googleId;
    },
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required() {
      return !this.googleId;
    },
    minlength: 6,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  avatar: {
    type: String,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  niveau: {
    type: String,
    enum: ['lycée', 'collège', null, undefined],
    default: null,
  },
  classe: {
    type: String,
    enum: ['6ème', '5ème', '4ème', '3ème', '2nd', '1ère', 'Terminale', null, undefined],
    default: null,
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  jetons: {
    type: Number,
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.isProfileComplete = function isProfileComplete() {
  if (this.authProvider === 'local') {
    return this.nom && this.prenom && this.niveau && this.classe;
  }
  if (this.authProvider === 'google') {
    return this.nom && this.prenom && this.niveau && this.classe;
  }
  return false;
};

userSchema.pre('save', async function preSaveUser(next) {
  if (this.authProvider === 'google') {
    this.profileCompleted = this.isProfileComplete();
    return next();
  }
  if (!this.isModified('password')) {
    this.profileCompleted = this.isProfileComplete();
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.profileCompleted = this.isProfileComplete();
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  if (this.authProvider === 'google') {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.canUsePassword = function canUsePassword() {
  return this.authProvider === 'local' && this.password;
};

userSchema.methods.canUseGoogle = function canUseGoogle() {
  return this.authProvider === 'google' && this.googleId;
};

userSchema.methods.mergeWithGoogle = function mergeWithGoogle(googleProfile) {
  this.googleId = googleProfile.id;
  this.authProvider = 'google';
  this.avatar = googleProfile.photos?.[0]?.value;
  if (!this.nom && googleProfile.name?.familyName) {
    this.nom = googleProfile.name.familyName;
  }
  if (!this.prenom && googleProfile.name?.givenName) {
    this.prenom = googleProfile.name.givenName;
  }
  this.profileCompleted = this.isProfileComplete();
};

module.exports = mongoose.model('User', userSchema);
