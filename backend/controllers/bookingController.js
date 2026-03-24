const Booking = require('../models/Booking');
const Package = require('../models/Package');

// @POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const { packageId, travelDate, numberOfPeople, specialRequests } = req.body;

    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });

    if (numberOfPeople > pkg.maxGroupSize)
      return res.status(400).json({ success: false, message: `Max group size is ${pkg.maxGroupSize}` });

    const totalPrice = pkg.price * Number(numberOfPeople);

    const booking = await Booking.create({
      user: req.user._id,
      package: packageId,
      travelDate,
      numberOfPeople: Number(numberOfPeople),
      totalPrice,
      specialRequests,
    });

    await booking.populate(['user', 'package']);
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// @GET /api/bookings/my  — user's own bookings
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('package', 'title location image price duration')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

// @GET /api/bookings  — admin: all bookings
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('package', 'title location price')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

// @PUT /api/bookings/:id/status  — admin
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate(['user', 'package']);

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// @DELETE /api/bookings/:id  — user cancel own booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) {
    next(err);
  }
};
