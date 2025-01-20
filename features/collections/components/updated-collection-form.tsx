"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

import { useConfirm } from "@/hooks/use-confirm";
import { Book, Collection } from "@prisma/client";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DottedSeparator from "@/components/dotted-separator";
import { MultiSelect } from "@/components/ui/multi-select";
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

import { useDeleteCollection } from "../api/use-delete-collection";
import { useUpdateCollection } from "../api/use-update-collection";
import { UpdateCollectionData } from "../schemas";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { collectionKeys } from "@/lib/queryKeys";

type UpdatedCollectionFormProps = {
  initialValue: Collection;
  books: Book[];
  onCancel?: () => void;
};

export default function UpdatedCollectionForm({
  initialValue,
  books,
  onCancel,
}: UpdatedCollectionFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClinet = useQueryClient();

  const { deleteCollection, isPending: isDeleteCollectionPending } =
    useDeleteCollection();
  const { updateCollection, isPending: isUpdateCollectionPending } =
    useUpdateCollection();
  const isLoadiing = isDeleteCollectionPending || isUpdateCollectionPending;

  const form = useForm<UpdateCollectionData>({
    defaultValues: {
      ...initialValue,
      books: books.map((book) => book.id),
      description: initialValue.description || "",
      image: initialValue.image || undefined,
    },
  });

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Delete workspace",
    message: "Are you sure you want to delete this workspace?",
    variant: "destructive",
  });

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB max)
    if (file.size > 1024 * 1024) {
      toast({
        variant: "destructive",
        description: "Image size should not exceed 1MB.",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          // Set the image field to the base64 string of the new image
          form.setValue("image", reader.result as string);
        }
      };

      reader.onerror = () => {
        toast({
          variant: "destructive",
          description: "Failed to read the image file. Please try again.",
        });
      };

      reader.readAsDataURL(file); // Convert file to base64
    } catch (error) {
      console.error("Error during image handling:", error);
      toast({
        variant: "destructive",
        description: "An unexpected error occurred during image upload.",
      });
    }
  };

  const handleConfirm = async () => {
    const ok = await confirm();

    if (ok) {
      deleteCollection(initialValue.id, {
        onSuccess: () => {
          queryClinet.invalidateQueries({
            queryKey: collectionKeys.collections,
          });
          toast({
            variant: "destructive",
            description: "Collection deleted successfully",
          });
          router.push("/");
        },
      });
    }
  };

  const onSubmit = (values: UpdateCollectionData) => {
    updateCollection(
      {
        json: {
          ...values,
        },
        param: { collectionId: initialValue.id },
      },
      {
        onSuccess: () => {
          toast({
            description: "Collection updated successfully",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <ConfirmationDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex p-7">
          <CardTitle className="text-xl font-bold">Update collection</CardTitle>
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
                          disabled={isLoadiing}
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
                <Button type="submit" disabled={isLoadiing}>
                  Update Collection
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="text-destructive font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a collection is an irreversable proccess and will remove
              associated data
            </p>
            <DottedSeparator className="py-7" />
            <Button
              variant="destructive"
              size="sm"
              className="mt-6 w-fit ml-auto"
              disabled={isLoadiing}
              onClick={handleConfirm}
            >
              Delete collection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
