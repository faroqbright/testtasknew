import mongoose, { Schema, models, Model } from 'mongoose';
import { ICategory, IAttributeSchema } from '@/types';

const AttributeSchemaObject: Schema<IAttributeSchema> = new Schema({
  name: { type: String, required: true },
  attributeKey: { type: String, required: true },
  type: { type: String, required: true, enum: ['checkbox', 'dropdown', 'text'] },
}, { _id: false });

const CategorySchema: Schema<ICategory> = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  attributeSchema: [AttributeSchemaObject],
}, { timestamps: true });

const CategoryModel = (models.Category as Model<ICategory>) || mongoose.model<ICategory>('Category', CategorySchema);

export default CategoryModel;