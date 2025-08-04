import mongoose, { Schema, Document, models } from 'mongoose';

interface ITag extends Document {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // FIX: Added an index to the slug. This makes finding posts
      // by their tag much faster, which is useful for filtering.
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// FIX: Refined the export for consistency with the other models.
export default models.Tag || mongoose.model<ITag>('Tag', TagSchema);
