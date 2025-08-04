// 'use client';

// import { useState } from 'react';
// import { z } from 'zod';
// import { slugify } from '@/lib/slugify';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';

// // --- shadcn/ui Component Imports ---
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Loader2, AlertCircle, CheckCircle2, Tag, Hash } from 'lucide-react';

// // --- Zod Schema (Unchanged) ---
// const tagSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().min(1, 'Tag name is required'),
// });

// type TagFormValues = z.infer<typeof tagSchema>;

// // --- Component Props (Unchanged) ---
// interface TagFormProps {
//   action: (formData: FormData) => Promise<{ success: boolean; message: string }>;
//   submitLabel: string;
//   defaultValues?: Partial<TagFormValues>;
//   isEdit?: boolean;
// }

// // --- Enhanced TagForm Component with shadcn/ui ---
// export default function TagForm({ 
//   action, 
//   submitLabel, 
//   defaultValues, 
//   isEdit = false 
// }: TagFormProps) {
//   const [serverError, setServerError] = useState<string | null>(null);
//   const [serverSuccess, setServerSuccess] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // --- React Hook Form with Zod ---
//   const form = useForm<TagFormValues>({
//     resolver: zodResolver(tagSchema),
//     defaultValues: {
//       id: defaultValues?.id || '',
//       name: defaultValues?.name || '',
//     },
//   });

//   // --- Form Submission Handler ---
//   const handleSubmit = async (values: TagFormValues) => {
//     setServerError(null);
//     setServerSuccess(null);
//     setIsSubmitting(true);

//     const formData = new FormData();
//     if (values.id) {
//       formData.append('id', values.id);
//     }
//     formData.append('name', values.name);

//     try {
//       const result = await action(formData);
//       if (result.success) {
//         setServerSuccess(result.message);
//         // Reset the form only when creating a new tag
//         if (!isEdit) {
//           form.reset();
//         }
//       } else {
//         setServerError(result.message);
//       }
//     } catch (e) {
//       console.error("Form submission error:", e);
//       setServerError("An unexpected error occurred. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   // Generate slug preview from current form values
//   const watchedName = form.watch('name');
//   const slugPreview = watchedName ? slugify(watchedName) : '';

//   return (
//     <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
//       <CardHeader className="space-y-1 pb-6">
//         <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           <Tag className="h-6 w-6 text-blue-600" />
//           {isEdit ? 'Edit Tag' : 'Create New Tag'}
//         </CardTitle>
//       </CardHeader>
      
//       <CardContent>
//         <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//           {/* Hidden ID field for edit mode */}
//           {isEdit && (
//             <input type="hidden" {...form.register('id')} />
//           )}

//           {/* Tag Name Input */}
//           <div className="space-y-3">
//             <Label htmlFor="tag-name" className="text-sm font-semibold text-gray-700">
//               Tag Name <span className="text-red-500">*</span>
//             </Label>
//             <div className="relative">
//               <Input
//                 id="tag-name"
//                 placeholder="e.g., Next.js, React, TypeScript"
//                 className="pl-10 h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
//                 {...form.register('name')}
//               />
//               <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             </div>
//             {form.formState.errors.name && (
//               <p className="text-sm text-red-600 flex items-center gap-1">
//                 <AlertCircle className="h-4 w-4" />
//                 {form.formState.errors.name.message}
//               </p>
//             )}
//           </div>

//           {/* Slug Preview */}
//           {slugPreview && (
//             <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//               <div className="flex items-center gap-2 mb-2">
//                 <Hash className="h-4 w-4 text-gray-500" />
//                 <Label className="text-sm font-medium text-gray-700">Generated Slug</Label>
//               </div>
//               <Badge variant="outline" className="font-mono text-sm px-3 py-1 bg-white">
//                 {slugPreview}
//               </Badge>
//             </div>
//           )}

//           {/* Success Message */}
//           {serverSuccess && (
//             <Alert className="border-green-200 bg-green-50">
//               <CheckCircle2 className="h-4 w-4 text-green-600" />
//               <AlertDescription className="text-green-800 font-medium">
//                 {serverSuccess}
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Error Message */}
//           {serverError && (
//             <Alert className="border-red-200 bg-red-50">
//               <AlertCircle className="h-4 w-4 text-red-600" />
//               <AlertDescription className="text-red-800 font-medium">
//                 {serverError}
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Submit Button */}
//           <div className="flex justify-end pt-4">
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="min-w-[120px] h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 submitLabel
//               )}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }



'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface TagFormProps {
  action: (formData: FormData) => Promise<{ success: boolean; message: string }>;
  submitLabel: string;
  initialValues?: { name: string };
}

export default function TagForm({ action, submitLabel, initialValues }: TagFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result.success) {
        router.push('/admin/tags');
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Tag Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={initialValues?.name || ''}
          required
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
        {isPending ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}