"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useRef } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { Book } from "@prisma/client";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DottedSeparator from "@/components/dotted-separator";
import { MultiSelect } from "@/components/ui/multi-select";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { CreateCollectionData, CreateCollectionSchema } from "../schemas";
import { useCreateCollection } from "../api/use-create-collection";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

type CreateCollectionFormProps = {
  onCancel?: () => void;
  books: Book[];
};

export default function CreateCollectionForm({
  onCancel,
  books,
}: CreateCollectionFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { createCollection, isPending } = useCreateCollection();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: session } = useSession();

  const form = useForm<CreateCollectionData>({
    resolver: zodResolver(CreateCollectionSchema),
    defaultValues: {
      name: "",
      description: "",
      image: undefined,
      books: [],
    },
  });

  const onSubmit = (values: CreateCollectionData) => {
    createCollection(
      {
        json: {
          ...values,
          image: values.image || undefined,
        },
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["collections"] });
          queryClient.invalidateQueries({ queryKey: ["collection"] });
          toast({
            description: "Collection created successfully",
          });
          form.reset();
          router.push(`/collections/${data.data.id}`);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            description: error.message || "Failed to create collection",
          });
        },
      },
    );
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast({
        variant: "destructive",
        description: "Image size should not exceed 1MB",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      form.setValue("image", reader.result as string); // Set the base64 string
    };
    reader.readAsDataURL(file); // Convert to base64
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new collection
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter the name of the collection"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-5">
                    {field.value ? (
                      <div className="size-[72px] relative rounded-md overflow-hidden">
                        <Image
                          src={
                            field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : field.value
                          }
                          alt="Collection Icon"
                          className="object-cover"
                          fill
                        />
                      </div>
                    ) : (
                      <Avatar className="size-[72px]">
                        <AvatarFallback>
                          <ImageIcon className="size-[36px] text-neutral-400" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">Collection Icon</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG, SVG or JPEG up to 1MB
                      </p>
                      <input
                        type="file"
                        ref={inputRef}
                        className="hidden"
                        accept=".jpg, .png, .jpeg, .svg"
                        disabled={isPending}
                        onChange={handleImageChange}
                      />
                      <Button
                        type="button"
                        variant={field.value ? "destructive" : "secondary"}
                        className="w-fit mt-2"
                        onClick={() => {
                          if (field.value) {
                            field.onChange(undefined);
                            if (inputRef.current) {
                              inputRef.current.value = "";
                            }
                          } else {
                            inputRef.current?.click();
                          }
                        }}
                      >
                        {field.value ? "Remove Image" : "Upload Image"}
                      </Button>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the description of the collection"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="books"
              render={({ field }) => (
                <FormItem>
                  <MultiSelect
                    placeholder="Select books"
                    options={books.map((book) => ({
                      label: book.title,
                      value: book.id,
                    }))}
                    value={field.value || []}
                    onValueChange={(selected) => field.onChange(selected)}
                    animation={2}
                    maxCount={3}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="py-7">
              <DottedSeparator />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !session}>
                {session ? "Create Collection" : "Sign in to create collection"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
