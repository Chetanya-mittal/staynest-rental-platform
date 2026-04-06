import Property from "../models/Property.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @desc    Get all properties with search, filter, pagination
// @route   GET /api/properties
// @access  Public
export const getAllProperties = asyncHandler(async (req, res) => {
  const {
    city,
    state,
    country,
    minPrice,
    maxPrice,
    guests,
    page = 1, // default to page 1
    limit = 10, // default 10 results per page
  } = req.query;

  const query = { isAvailable: true };

  if (city) {
    // 'i' flag = case insensitive so 'mumbai' matches 'Mumbai'
    query["location.city"] = { $regex: city, $options: "i" };
  }

  if (state) {
    query["location.state"] = { $regex: state, $options: "i" };
  }

  if (country) {
    query["location.country"] = { $regex: country, $options: "i" };
  }

  if (guests) {
    query.maxGuests = { $gte: Number(guests) };
  }

  if (minPrice || maxPrice) {
    query.pricePerNight = {};
    if (minPrice) query.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
  }

  // Pagination
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  // Run both queries in parallel for efficiency
  const [properties, total] = await Promise.all([
    Property.find(query)
      .populate("host", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Property.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: properties,
    currentPage: pageNum,
    totalPages: Math.ceil(total / limitNum),
    totalProperties: total,
    hasNextPage: pageNum < Math.ceil(total / limitNum),
  });
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    "host",
    "name email",
  );

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  res.status(200).json({ success: true, data: property });
});

// @desc    Create a property
// @route   POST /api/properties
// @access  Private (host only)
export const createProperty = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    location,
    pricePerNight,
    maxGuests,
    bedrooms,
    bathrooms,
    amenities,
    images,
  } = req.body;

  const property = await Property.create({
    host: req.user._id, // comes from protect middleware
    title,
    description,
    location,
    pricePerNight,
    maxGuests,
    bedrooms,
    bathrooms,
    amenities,
    images,
  });

  res.status(201).json({ success: true, data: property });
});

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private (owner only)
export const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  // Check the logged-in user is actually the owner
  if (property.host.toString() !== req.user._id.toString()) {
    throw new AppError("Property not found", 404);
  }

  const updated = await Property.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }, // return updated doc + run schema validators
  );

  res.status(200).json({ success: true, data: updated });
});

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (owner only)
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (property.host.toString() !== req.user._id.toString()) {
    throw new AppError("Property not found", 404);
  }

  await property.deleteOne();

  res
    .status(200)
    .json({ success: true, message: "Property deleted successfully" });
});

// @desc    Get my properties
// @route   GET /api/properties/my
// @access  Private
export const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ host: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({ success: true, data: properties });
});
