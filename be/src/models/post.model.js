const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const slugify = require('slugify');

const Images = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
});

const Post = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
    maxlength: 100
  },
  address: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  maxPeople: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
  },
  images: [Images],
  categories: { type: Schema.Types.ObjectId, ref: 'Category' },
  security: [{ type: Schema.Types.ObjectId, ref: 'Security' }],
  utils: [{ type: Schema.Types.ObjectId, ref: 'Utils' }],
  interiors: [{ type: Schema.Types.ObjectId, ref: 'Interior' }],
  slug: {
    type: String, unique: true
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  isLock: {
    type: Boolean,
    default: false,
  },
  reason:{
    type:String,
    default:null
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  comment: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Comment',
  }]

}, { timestamps: true });


Post.pre('save', function (next) {
  if (!this.isModified('title')) {
    return next();
  }

  this.slug = slugify(this.title, { lower: true });
  this.constructor
    .findOne({ slug: this.slug })
    .then(existingDoc => {
      if (existingDoc) {
        let suffix = 1;
        const findUniqueSlug = async () => {
          const newSlug = `${this.slug}-${suffix}`;
          const doc = await this.constructor.findOne({ slug: newSlug });
          if (doc) {
            suffix++;
            await findUniqueSlug();
          } else {
            this.slug = newSlug;
            next();
          }
        };
        findUniqueSlug();
      } else {
        next();
      }
    })
    .catch(error => next(error));
});
module.exports = mongoose.model("Post", Post);