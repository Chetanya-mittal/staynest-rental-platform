import { QueryFilter } from "mongoose";
import { Property, IProperty } from "../models/property.model.js";
import {
  propertyQuerySchema,
  createPropertySchema,
  updatePropertySchema,
} from "../validations/property.validation.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import ApiResponse from "../utils/ApiResponse.js";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeLocationTerms = (value?: string) => {
  if (!value) return [];

  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return [];

  return trimmed
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .flatMap((part) => {
      const words = part.split(/\s+/).filter(Boolean);
      return words.length > 1 ? [part, ...words] : [part];
    });
};

const buildLocationSearchQuery = (
  city?: string,
  state?: string,
  country?: string,
) => {
  const terms = [city, state, country]
    .flatMap(normalizeLocationTerms)
    .map((term) => term.toLowerCase())
    .filter(Boolean);

  if (terms.length === 0) {
    return undefined;
  }

  const uniqueTerms = [...new Set(terms)];

  return {
    $or: uniqueTerms.flatMap((term) => [
      { "location.city": { $regex: escapeRegex(term), $options: "i" } },
      { "location.state": { $regex: escapeRegex(term), $options: "i" } },
      { "location.country": { $regex: escapeRegex(term), $options: "i" } },
    ]),
  };
};

// @desc    Get all properties with search, filter, pagination
// @route   GET /api/properties
// @access  Public
export const getAllProperties = asyncHandler(async (req, res) => {
  const { city, state, country, minPrice, maxPrice, guests, page, limit } =
    propertyQuerySchema.parse(req.query);

  const query: QueryFilter<IProperty> = { isAvailable: true };

  const locationSearchQuery = buildLocationSearchQuery(city, state, country);

  if (locationSearchQuery) {
    Object.assign(query, locationSearchQuery);
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
    Property.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Property.countDocuments(query),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        properties,
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalProperties: total,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
      },
      "Properties retrieved successfully",
    ),
  );
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    "host",
    "name email role avatar",
  );

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  res.status(200).json(new ApiResponse(200, { property }));
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
  } = createPropertySchema.parse(req.body);

  const property = await Property.create({
    host: req.user?._id, // comes from protect middleware
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

  res.status(201).json(new ApiResponse(201, { property }));
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
  if (property.host.toString() !== req.user?._id.toString()) {
    throw new AppError("Property not found", 404);
  }

  const updated = updatePropertySchema.parse(req.body);

  property.set(updated);
  await property.save();

  res.status(200).json(new ApiResponse(200, { property }));
});

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (owner only)
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (property.host.toString() !== req.user?._id.toString()) {
    throw new AppError("Property not found", 404);
  }

  await property.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Property deleted successfully"));
});

// @desc    Get my properties
// @route   GET /api/properties/my
// @access  Private
export const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ host: req.user?._id }).sort({
    createdAt: -1,
  });

  res.status(200).json(new ApiResponse(200, { properties }));
});
