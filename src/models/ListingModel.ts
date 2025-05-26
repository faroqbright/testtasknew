import mongoose, { Schema, models, Model } from 'mongoose';
import { IListing } from '@/types';

const ListingSchema: Schema<IListing> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String }, // Ensure location is present
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  attributes: { type: Schema.Types.Map, of: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

// Updated text index to include title, description, location, and all string values in attributes
ListingSchema.index({
  title: 'text',
  description: 'text',
  location: 'text',
  'attributes.$**': 'text' // This indexes all string values within the 'attributes' map
});

// These are individual field indexes, good for specific attribute filtering and sorting. Keep them.
ListingSchema.index({ "attributes.brand": 1 });
ListingSchema.index({ "attributes.color": 1 });
ListingSchema.index({ "attributes.size": 1 });
ListingSchema.index({ "attributes.screenSize": 1 });
ListingSchema.index({ "attributes.resolution": 1 });
ListingSchema.index({ "attributes.gender": 1 });
ListingSchema.index({ "attributes.material": 1 });


const ListingModel = (models.Listing as Model<IListing>) || mongoose.model<IListing>('Listing', ListingSchema);

export default ListingModel;