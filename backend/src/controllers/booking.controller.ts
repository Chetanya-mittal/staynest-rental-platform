import mongoose from "mongoose";
import { Booking } from "../models/booking.model.js";
import { IProperty, Property } from "../models/property.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { calculateNights } from "../utils/dateHelpers.js";
import { createBookingSchema } from "../validations/booking.validation.js";
import { IUser } from "../models/user.model.js";

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { propertyId, checkIn, checkOut, guestsCount } =
    createBookingSchema.parse(req.body);

  // Check property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new AppError("Property not found", 404);
  }

  // Check property is available for booking
  if (!property.isAvailable) {
    throw new AppError(
      "This property is currently not available for booking",
      403,
    );
  }

  // Prevent host from booking their own property
  if (property.host.toString() === req.user?._id.toString()) {
    throw new AppError("You cannot book your own property", 400);
  }

  // Check guest count does not exceed property limit
  if (guestsCount > property.maxGuests) {
    throw new AppError(
      `This property allows a maximum of ${property.maxGuests} guests`,
      400,
    );
  }

  // Check for date overlap
  const overlappingBooking = await Booking.findOne({
    property: propertyId,
    status: { $ne: "cancelled" }, // ignore cancelled bookings
    $and: [
      { checkIn: { $lt: new Date(checkOut) } },
      { checkOut: { $gt: new Date(checkIn) } },
    ],
  });

  if (overlappingBooking) {
    throw new AppError("Property is not available for the selected dates", 400);
  }

  // Calculate price
  const totalNights = calculateNights(checkIn, checkOut);
  const totalPrice = totalNights * property.pricePerNight;

  // Create the booking
  const booking = await Booking.create({
    property: propertyId,
    guest: req.user?._id,
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    totalNights,
    totalPrice,
    guestsCount,
  });

  // Populate and return
  const populated = await booking.populate([
    { path: "property", select: "title location pricePerNight images host" },
    { path: "guest", select: "name email" },
  ]);

  res.status(201).json(new ApiResponse(201, { booking: populated }));
});

// @desc    Get my bookings (as guest)
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    guest: req.user?._id,
    status: { $ne: "cancelled" },
  })
    .populate([
      { path: "property", select: "title location pricePerNight images host" },
      { path: "guest", select: "name email" },
    ])
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, { bookings }));
});

// @desc    Get bookings on my properties (as host)
// @route   GET /api/bookings/host
// @access  Private
export const getHostBookings = asyncHandler(async (req, res) => {
  // all properties owned by this user
  const myProperties = await Property.find({ host: req.user?._id }).select(
    "_id",
  );
  const propertyIds = myProperties.map((p) => p._id);

  // all bookings for those properties
  const bookings = await Booking.find({
    property: { $in: propertyIds },
    status: { $ne: "cancelled" },
  })
    .populate([
    { path: "property", select: "title location pricePerNight images host" },
    { path: "guest", select: "name email" },
  ])
    .sort({ checkIn: 1 }); // upcoming first

  res.status(200).json(new ApiResponse(200, { bookings }));
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate<{
      property: IProperty;
    }>("property", "title location images pricePerNight host")
    .populate<{
      guest: IUser & { _id: mongoose.Types.ObjectId };
    }>("guest", "name email");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  // Only the guest or the property host can view this booking
  const isGuest = booking.guest._id.toString() === req.user?._id.toString();
  const isHost = booking.property.host.toString() === req.user?._id.toString();

  if (!isGuest && !isHost) {
    throw new AppError("Booking not found", 404);
  }

  res.status(200).json(new ApiResponse(200, { booking }));
});

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  // Only the guest who made the booking can cancel it
  if (booking.guest.toString() !== req.user?._id.toString()) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.status === "cancelled") {
    throw new AppError("Booking is already cancelled", 400);
  }

  booking.status = "cancelled";
  await booking.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Booking cancelled successfully"));
});

// @desc    Get all bookings for a property (to show unavailable dates)
// @route   GET /api/bookings/property/:propertyId
// @access  Public
export const getPropertyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    property: req.params.propertyId,
    status: { $ne: "cancelled" },
    checkOut: { $gte: new Date() }, // only future/current bookings
  }).select("checkIn checkOut status");

  res.status(200).json(new ApiResponse(200, { bookings }));
});
