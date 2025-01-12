"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCollectionData, CreateCollectionSchema } from "../schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateCollection } from "../api/use-create-collection";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

type CreateCollectionFormProps = {
  onCancel?: () => void;
};

export default function CreateCollectionForm({
  onCancel,
  userId,
}: CreateCollectionFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { createCollection, isPending } = useCreateCollection();

  const form = useForm<CreateCollectionData>({
    resolver: zodResolver(CreateCollectionSchema),
    defaultValues: {
      name: "",
      description: "",
      userId: userId,
      image: undefined,
      bookIds: [],
    },
  });

  const onSubmit = (values: CreateCollectionData) => {
    createCollection(
      {
        json: {
          ...values,
          bookIds: values.bookIds || [],
        },
      },
      {
        onSuccess: () => {
          toast({
            description: "Collection created successfully",
          });
          form.reset();
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        // 1MB limit
        toast({
          variant: "destructive",
          description: "Image size should not exceed 1MB",
        });
        return;
      }
      form.setValue("image", file);
    }
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
              name="bookIds"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter book IDs (comma separated)"
                      value={field.value?.join(", ") || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .split(",")
                            .map((id) => id.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                  </FormControl>
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
              <Button type="submit" disabled={isPending}>
                Create Collection
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
