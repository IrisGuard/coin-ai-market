import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast"
import { useCreateCoin } from '@/hooks/useCoinMutations';
import { uploadImage } from '@/integrations/supabase/storage';

const coinFormSchema = z.object({
  name: z.string().min(2, {
    message: "Coin name must be at least 2 characters.",
  }),
  year: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }, {
    message: "Year must be a valid number.",
  }),
  grade: z.string().min(2, {
    message: "Grade must be at least 2 characters.",
  }),
  price: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }, {
    message: "Price must be a valid number.",
  }),
  rarity: z.enum(['Common', 'Uncommon', 'Rare', 'Legendary']),
  country: z.string().optional(),
  denomination: z.string().optional(),
  description: z.string().optional(),
  composition: z.string().optional(),
  diameter: z.string().optional(),
  weight: z.string().optional(),
  mint: z.string().optional(),
  image: z.string().optional(),
})

interface CoinFormValues extends z.infer<typeof coinFormSchema> {}

const MobileCoinUploadForm = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast()
  const createCoin = useCreateCoin();

  const form = useForm<CoinFormValues>({
    resolver: zodResolver(coinFormSchema),
    defaultValues: {
      name: "",
      year: "",
      grade: "",
      price: "",
      rarity: "Common",
      country: "",
      denomination: "",
      description: "",
      composition: "",
      diameter: "",
      weight: "",
      mint: "",
      image: "",
    },
  })

  const onImageDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    try {
      if (!file) {
        toast({
          title: "Error",
          description: "No file selected",
          variant: "destructive",
        });
        return;
      }
      const uploadedUrl = await uploadImage(file);
      setImageUrl(uploadedUrl);
      form.setValue('image', uploadedUrl);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast, form, setImageUrl]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    },
    maxFiles: 1,
    onDrop: onImageDrop
  })

  function onSubmit(data: CoinFormValues) {
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please upload an image",
        variant: "destructive",
      });
      return;
    }

    createCoin.mutate({
      name: data.name,
      year: parseInt(data.year),
      grade: data.grade,
      price: parseFloat(data.price),
      rarity: data.rarity as any,
      image: imageUrl,
      country: data.country,
      denomination: data.denomination,
      description: data.description,
      composition: data.composition,
      diameter: data.diameter ? parseFloat(data.diameter) : undefined,
      weight: data.weight ? parseFloat(data.weight) : undefined,
      mint: data.mint,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coin Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input placeholder="2023" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <FormControl>
                <Input placeholder="MS65" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rarity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rarity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rarity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Common">Common</SelectItem>
                  <SelectItem value="Uncommon">Uncommon</SelectItem>
                  <SelectItem value="Rare">Rare</SelectItem>
                  <SelectItem value="Legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="USA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="denomination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Denomination</FormLabel>
              <FormControl>
                <Input placeholder="1 Dollar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A short description about the coin"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="composition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Composition</FormLabel>
              <FormControl>
                <Input placeholder="Silver" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="diameter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diameter</FormLabel>
              <FormControl>
                <Input placeholder="38.1 mm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight</FormLabel>
              <FormControl>
                <Input placeholder="26.73 g" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mint</FormLabel>
              <FormControl>
                <Input placeholder="Philadelphia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div {...getRootProps()} className={cn(
                  "border-dashed border-2 rounded-md p-4 flex flex-col items-center justify-center",
                  isDragActive ? "border-primary" : "border-muted",
                  imageUrl ? "bg-secondary" : "bg-background"
                )}>
                  <input {...getInputProps()} />
                  {imageUrl ? (
                    <img src={imageUrl} alt="Uploaded Image" className="max-w-full max-h-32" />
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {isDragActive ? "Drop the image here ..." : "Click or drag an image to upload"}
                      </p>
                    </>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createCoin.isPending}>
          {createCoin.isPending ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Uploading ...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Coin
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default MobileCoinUploadForm;
