import mongoose, { Schema, Document, models } from 'mongoose';

// FIX: Added an 'author' field to track who created the post.
// This is crucial for any multi-user CMS.
interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  coverImage?: string | null;
  status: 'draft' | 'published' | 'scheduled';
  author: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // FIX: Added an index to the slug field. This significantly improves
      // the performance of queries that look up posts by their slug.
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: false,
      default: null,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'draft',
    },
    // FIX: Added the 'author' field to the schema definition.
    // It references the 'User' model, which you'll likely have for Clerk authentication.
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    publishedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// FIX: Changed the export to use `models.Post` for better type inference
// and consistency across the project. The original logic was correct, this is a minor refinement.
export default models.Post || mongoose.model<IPost>('Post', PostSchema);

