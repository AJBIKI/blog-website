'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { uploadImageToCloudinary } from '@/lib/cloudinaryUpload';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostFormCategory, PostFormTag } from '@/types/database';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

// Icons
import { Upload, ImageIcon, X, Check, AlertCircle, Calendar, Tag, FileText, Globe, Clock, Loader2 } from 'lucide-react';

// --- Zod Schema (Unchanged) ---
const postSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'scheduled']),
  coverImage: z.string().optional(),
  publishedAt: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

// --- Component Props ---
interface PostFormProps {
  categories: PostFormCategory[];
  tags: PostFormTag[];
  action: (formData: FormData) => Promise<{ success: boolean; message: string; redirect?: string }>;
  submitLabel: string;
  defaultValues?: Partial<PostFormValues>;
}

// --- Date Formatting Utility (Unchanged) ---
const formatDateTimeForInput = (dateString?: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
  } catch (e) {
    console.error("Invalid date format for 'publishedAt':", dateString);
    return '';
  }
};

export default function PostForm({ categories, tags, action, submitLabel, defaultValues }: PostFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.coverImage || null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultValues?.tags || []);

  // React Hook Form with Zod validation
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      _id: defaultValues?._id || '',
      title: defaultValues?.title || '',
      content: defaultValues?.content || '',
      category: defaultValues?.category || '',
      tags: defaultValues?.tags || [],
      status: defaultValues?.status || 'draft',
      coverImage: defaultValues?.coverImage || '',
      publishedAt: formatDateTimeForInput(defaultValues?.publishedAt),
    },
  });

  // --- Image Upload Handler ---
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setServerError(null);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const secureUrl = await uploadImageToCloudinary(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      form.setValue('coverImage', secureUrl);
      setImagePreview(secureUrl);
    } catch (error) {
      console.error('Image upload error:', error);
      form.setError('coverImage', { message: 'Failed to upload image. Please try another file.' });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // --- Tag Management ---
  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newTags);
    form.setValue('tags', newTags);
  };

  const removeTag = (tagId: string) => {
    const newTags = selectedTags.filter(id => id !== tagId);
    setSelectedTags(newTags);
    form.setValue('tags', newTags);
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (values: PostFormValues) => {
    setServerError(null);
    setServerSuccess(null);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'tags' && Array.isArray(value)) {
        value.forEach(tagId => formData.append('tags', tagId));
      } else if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });

    try {
      const result = await action(formData);
      if (result.success) {
        setServerSuccess(result.message);
        if (!defaultValues?._id) {
          form.reset();
          setImagePreview(null);
          setSelectedTags([]);
        }
        if (result.redirect) {
          router.push(result.redirect);
          router.refresh();
        }
      } else {
        setServerError(result.message);
      }
    } catch (e) {
      console.error("Form submission error:", e);
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <Globe className="w-3 h-3" />;
      case 'scheduled': return <Clock className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {defaultValues?._id ? 'Edit Post' : 'Create New Post'}
        </h1>
        <p className="text-muted-foreground">
          {defaultValues?._id ? 'Update your existing post' : 'Share your thoughts with the world'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Hidden ID field for edit mode */}
          {defaultValues?._id && <input type="hidden" {...form.register('_id')} />}

          {/* Main Content Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Post Content
              </CardTitle>
              <CardDescription>
                The main content and details of your post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter an engaging title..."
                        className="text-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Content *</FormLabel>
                    <FormDescription>
                      Write your post content in Markdown format
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Write your amazing content here..."
                        className="min-h-[300px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Media Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Cover Image
              </CardTitle>
              <CardDescription>
                Upload a cover image to make your post more engaging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Image Upload */}
                <div className="flex items-center justify-center w-full">
                  <Label
                    htmlFor="cover-image"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      uploading 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 mb-2 text-blue-500 animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      )}
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <Input
                      id="cover-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </Label>
                </div>

                {/* Upload Progress */}
                {uploading && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview(null);
                        form.setValue('coverImage', '');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {form.formState.errors.coverImage && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.coverImage.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Organization Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Organization
              </CardTitle>
              <CardDescription>
                Categorize and tag your post for better discoverability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Tags</Label>
                <p className="text-sm text-muted-foreground">
                  Select relevant tags to help readers find your content
                </p>
                
                {/* Selected Tags */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tagId) => {
                      const tag = tags.find(t => t._id === tagId);
                      return tag ? (
                        <Badge key={tagId} variant="secondary" className="px-3 py-1">
                          {tag.name}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-2"
                            onClick={() => removeTag(tagId)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Available Tags */}
                <ScrollArea className="h-32 w-full border rounded-md p-4">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag._id}
                        variant={selectedTags.includes(tag._id) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => handleTagToggle(tag._id)}
                      >
                        {selectedTags.includes(tag._id) && <Check className="w-3 h-3 mr-1" />}
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Publishing Options
              </CardTitle>
              <CardDescription>
                Control when and how your post is published
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Draft
                          </div>
                        </SelectItem>
                        <SelectItem value="published">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Published
                          </div>
                        </SelectItem>
                        <SelectItem value="scheduled">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Scheduled
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Publish Date */}
              <FormField
                control={form.control}
                name="publishedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Publish Date</FormLabel>
                    <FormDescription>
                      Leave empty to publish immediately when status is set to published
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Preview */}
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Current status:</span>
                <Badge className={getStatusColor(form.watch('status'))}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(form.watch('status'))}
                    {form.watch('status')}
                  </div>
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Server Messages */}
          {serverSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {serverSuccess}
              </AlertDescription>
            </Alert>
          )}

          {serverError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {serverError}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="min-w-[120px]"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}