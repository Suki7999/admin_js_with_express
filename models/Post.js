const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    banner: { type: String, required: true },
    createAt: { type: Date, default: Date.now }, // Create time will be set to current date by default
    updateAt: { type: Date, default: Date.now }
});

// Add a pre-save hook to update the `updateAt` field whenever the post is updated
PostSchema.pre('save', function(next) {
    if (this.isModified()) {
        this.updateAt = Date.now(); // Update `updateAt` to current time on any modification
    }
    next();
});

module.exports = mongoose.model('Post', PostSchema);
