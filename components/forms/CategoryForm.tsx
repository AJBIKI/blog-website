// 'use client';

// import { useState } from 'react';
// import { z } from 'zod';
// import { slugify } from '@/lib/slugify';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';

// // shadcn/ui imports
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Badge } from '@/components/ui/badge';
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Separator } from '@/components/ui/separator';

// // Icons
// import { Tag, Link2, Check, AlertCircle, Loader2, Plus, Edit3 } from 'lucide-react';

// // --- Zod Schema (Unchanged) ---
// const categorySchema = z.object({
//   id: z.string().optional(),
//   name: z.string().min(1, 'Category name is required'),
// });

// type CategoryFormValues = z.infer<typeof categorySchema>;

// // --- Component Props (Unchanged) ---
// interface CategoryFormProps {
//   action: (formData: FormData) => Promise<{ success: boolean; message: string }>;
//   submitLabel: string;
//   defaultValues?: Partial<CategoryFormValues>;
//   isEdit?: boolean;
// }

// export default function CategoryForm({ action, submitLabel, defaultValues, isEdit = false }: CategoryFormProps) {
//   const [serverError, setServerError] = useState<string | null>(null);
//   const [serverSuccess, setServerSuccess] = useState<string | null>(null);

//   // React Hook Form with Zod validation
//   const form = useForm<CategoryFormValues>({
//     resolver: zodResolver(categorySchema),
//     defaultValues: {
//       id: defaultValues?.id || '',
//       name: defaultValues?.name || '',
//     },
//   });

//   // Watch the name field for real-time slug preview
//   const categoryName = form.watch('name');
//   const slugPreview = categoryName ? slugify(categoryName) : '';

//   // --- Form Submission Handler ---
//   const handleSubmit = async (values: CategoryFormValues) => {
//     setServerError(null);
//     setServerSuccess(null);

//     const formData = new FormData();
//     if (values.id) {
//       formData.append('id', values.id);
//     }
//     formData.append('name', values.name);

//     try {
//       const result = await action(formData);
//       if (result.success) {
//         setServerSuccess(result.message);
//         // Reset the form only when creating a new category.
//         if (!isEdit) {
//           form.reset();
//         }
//       } else {
//         setServerError(result.message);
//       }
//     } catch (e) {
//       console.error("Form submission error:", e);
//       setServerError("An unexpected error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 space-y-6">
//       {/* Header */}
//       <div className="space-y-2">
//         <div className="flex items-center gap-3">
//           <div className={`p-2 rounded-lg ${isEdit ? 'bg-blue-100' : 'bg-green-100'}`}>
//             {isEdit ? (
//               <Edit3 className={`w-5 h-5 ${isEdit ? 'text-blue-600' : 'text-green-600'}`} />
//             ) : (
//               <Plus className={`w-5 h-5 ${isEdit ? 'text-blue-600' : 'text-green-600'}`} />
//             )}
//           </div>
//           <h1 className="text-2xl font-bold tracking-tight">
//             {isEdit ? 'Edit Category' : 'Create New Category'}
//           </h1>
//         </div>
//         <p className="text-muted-foreground">
//           {isEdit 
//             ? 'Update the category information below' 
//             : 'Categories help organize your content and make it easier for readers to find'
//           }
//         </p>
//       </div>

//       <Form {...form}>
//         <div className="space-y-6">
//           {/* Hidden ID field for edit mode */}
//           {defaultValues?.id && <input type="hidden" {...form.register('id')} />}

//           {/* Main Content Card */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Tag className="w-5 h-5" />
//                 Category Details
//               </CardTitle>
//               <CardDescription>
//                 Enter the category name. A URL-friendly slug will be automatically generated.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Category Name */}
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-base font-medium">Category Name *</FormLabel>
//                     <FormDescription>
//                       Choose a clear, descriptive name for your category
//                     </FormDescription>
//                     <FormControl>
//                       <Input
//                         placeholder="e.g., Technology, Lifestyle, Business"
//                         className="text-lg"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Separator />

//               {/* Slug Preview */}
//               <div className="space-y-3">
//                 <div className="flex items-center gap-2">
//                   <Link2 className="w-4 h-4 text-muted-foreground" />
//                   <Label className="text-base font-medium">URL Slug</Label>
//                 </div>
//                 <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed">
//                   {slugPreview ? (
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <Badge variant="secondary" className="font-mono">
//                           {slugPreview}
//                         </Badge>
//                         <span className="text-sm text-muted-foreground">
//                           Auto-generated from category name
//                         </span>
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         This will be used in URLs: <code className="bg-background px-1 py-0.5 rounded text-xs">/categories/{slugPreview}</code>
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="text-center py-2">
//                       <p className="text-sm text-muted-foreground">
//                         URL slug will appear here as you type the category name
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Category Preview */}
//               {categoryName && (
//                 <div className="space-y-3">
//                   <Label className="text-base font-medium">Preview</Label>
//                   <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-primary/10 rounded-lg">
//                         <Tag className="w-4 h-4 text-primary" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-primary">{categoryName}</h3>
//                         <p className="text-sm text-muted-foreground">
//                           How this category will appear to readers
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Server Messages */}
//           {serverSuccess && (
//             <Alert className="border-green-200 bg-green-50">
//               <Check className="h-4 w-4 text-green-600" />
//               <AlertDescription className="text-green-800">
//                 {serverSuccess}
//               </AlertDescription>
//             </Alert>
//           )}

//           {serverError && (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>
//                 {serverError}
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Submit Button */}
//           <div className="flex justify-end pt-6">
//             <Button
//               type="submit"
//               size="lg"
//               disabled={form.formState.isSubmitting || !categoryName.trim()}
//               className="min-w-[120px]"
//               onClick={form.handleSubmit(handleSubmit)}
//             >
//               {form.formState.isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   {isEdit ? 'Updating...' : 'Creating...'}
//                 </>
//               ) : (
//                 <>
//                   {isEdit ? (
//                     <Edit3 className="mr-2 h-4 w-4" />
//                   ) : (
//                     <Plus className="mr-2 h-4 w-4" />
//                   )}
//                   {submitLabel}
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       </Form>
//     </div>
//   );
// }






//previous one not tested


//working but issue on deployment

// 'use client';

// import { useState, useTransition } from 'react';
// import { useRouter } from 'next/navigation';

// interface CategoryFormProps {
//   action: (formData: FormData) => Promise<{ success: boolean; message: string }>;
//   submitLabel: string;
// }

// export default function CategoryForm({ action, submitLabel }: CategoryFormProps) {
//   const [error, setError] = useState<string | null>(null);
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();

//   const handleSubmit = async (formData: FormData) => {
//     setError(null);
//     startTransition(async () => {
//       const result = await action(formData);
//       if (result.success) {
//         router.push('/admin/categories');
//       } else {
//         setError(result.message);
//       }
//     });
//   };

//   return (
//     <form action={handleSubmit} className="space-y-4">
//       <div>
//         <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//           Category Name
//         </label>
//         <input
//           type="text"
//           id="name"
//           name="name"
//           required
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//           disabled={isPending}
//         />
//       </div>
//       {error && <p className="text-red-500 text-sm">{error}</p>}
//       <button
//         type="submit"
//         disabled={isPending}
//         className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
//       >
//         {isPending ? 'Creating...' : submitLabel}
//       </button>
//     </form>
//   );
// }



'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface CategoryFormProps {
  action: (formData: FormData) => Promise<{ success: boolean; message: string; categoryId?: string; redirect?: string }>;
  submitLabel: string;
  initialValues?: { name: string }; // Add initialValues
}

export default function CategoryForm({ action, submitLabel, initialValues }: CategoryFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result.success) {
        router.push(result.redirect || '/admin/categories'); // Use redirect if provided
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Category Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={initialValues?.name ?? ''} // Use initialValues for pre-filling
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          disabled={isPending}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {isPending ? 'Submitting...' : submitLabel} // Update for consistency
      </button>
    </form>
  );
}