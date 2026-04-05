import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import { calculateNights, validateDates } from "../utils/dateHelpers.js";

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guestsCount } = req.body;

    // 1. Validate required fields
    if (!propertyId || !checkIn || !checkOut || !guestsCount) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // 2. Validate dates
    const dateError = validateDates(checkIn, checkOut);
    if (dateError) {
      return res.status(400).json({ message: dateError });
    }

    // 3. Check property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 4. Prevent host from booking their own property
    if (property.host.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot book your own property" });
    }

    // 5. Check guest count does not exceed property limit
    if (guestsCount > property.maxGuests) {
      return res.status(400).json({
        message: `This property allows a maximum of ${property.maxGuests} guests`,
      });
    }

    // 6. Check for date overlap
    const overlappingBooking = await Booking.findOne({
      property: propertyId,
      status: { $ne: "cancelled" }, // ignore cancelled bookings
      $and: [
        { checkIn: { $lt: new Date(checkOut) } },
        { checkOut: { $gt: new Date(checkIn) } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: "Property is not available for the selected dates",
      });
    }

    // 7. Calculate price
    const totalNights = calculateNights(checkIn, checkOut);
    const totalPrice = totalNights * property.pricePerNight;

    // 8. Create the booking
    const booking = await Booking.create({
      property: propertyId,
      guest: req.user._id,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      totalNights,
      totalPrice,
      guestsCount,
    });

    // 9. Populate and return
    const populated = await booking.populate([
      { path: "property", select: "title location pricePerNight images" },
      { path: "guest", select: "name email" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my bookings (as guest)
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      guest: req.user._id,
      status: { $ne: "cancelled" },
    })
      .populate("property", "title location images pricePerNight")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings on my properties (as host)
// @route   GET /api/bookings/host
// @access  Private
export const getHostBookings = async (req, res) => {
  try {
    // all properties owned by this user
    const myProperties = await Property.find({ host: req.user._id }).select(
      "_id",
    );
    const propertyIds = myProperties.map((p) => p._id);

    // all bookings for those properties
    const bookings = await Booking.find({
      property: { $in: propertyIds },
      status: { $ne: "cancelled" },
    })
      .populate("property", "title location")
      .populate("guest", "name email")
      .sort({ checkIn: 1 }); // upcoming first

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("property", "title location images pricePerNight host")
      .populate("guest", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only the guest or the property host can view this booking
    const isGuest = booking.guest._id.toString() === req.user._id.toString();
    const isHost = booking.property.host.toString() === req.user._id.toString();

    if (!isGuest && !isHost) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only the guest who made the booking can cancel it
    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res
      .status(200)
      .json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for a property (to show unavailable dates)
// @route   GET /api/bookings/property/:propertyId
// @access  Public
export const getPropertyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      property: req.params.propertyId,
      status: { $ne: "cancelled" },
      checkOut: { $gte: new Date() }, // only future/current bookings
    }).select("checkIn checkOut status");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
