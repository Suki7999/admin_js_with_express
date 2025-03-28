const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Хэрэглэгчийн нэр
    phone: { type: String, required: true }, // Утасны дугаар
    description: { type: String },  // Үйлчилгээний дэлгэрэнгүй тайлбар
    serviceType: { type: String, required: true },  // Үйлчилгээний төрөл (жишээ нь: хумсны засвар, өнгөлөг хумс гэх мэт)
    appointmentDate: { type: Date, required: true }, // Захиалгын огноо
    price: { type: Number, required: true },  // Үйлчилгээний үнэ
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], // Захиалгын статус
        default: 'Pending' 
    },
    banner: { type: String, required: true },  // Үзэмж (зураг, баннер)
    createAt: { type: Date, default: Date.now },  // Захиалга үүссэн огноо
    updateAt: { type: Date, default: Date.now }  // Захиалгын шинэчлэгдсэн огноо
});

// `updateAt` талбарыг шинэчлэх хүлээмж
OrderSchema.pre('save', function(next) {
    if (this.isModified()) {
        this.updateAt = Date.now(); // Хэрэв засвар оруулсан бол `updateAt`-г шинэчилнэ
    }
    next();
});

module.exports = mongoose.model('Order', OrderSchema);
