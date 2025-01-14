import { useConfirm } from "@/hooks/use-confirm";
import { Book, Collection } from "@prisma/client";
import { useForm } from "react-hook-form";
import { UpdateCollectionData } from "../schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import DottedSeparator from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ChangeEvent, useRef } from "react";
import { useDeleteCollection } from "../api/use-delete-collection";

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

  const { deleteCollection, isPending } = useDeleteCollection();

  const form = useForm<UpdateCollectionData>({
    defaultValues: {
      ...initialValue,
      description: initialValue.description || "",
      image: initialValue.image || undefined,
    },
  });

  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Delete workspace",
    message: "Are you sure you want to delete this workspace?",
    variant: "destructive",
  });

  const handleConfirm = async () => {
    const ok = await confirm();

    if (ok) {
      deleteCollection(initialValue.id);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const onSubmit = (values: UpdateCollectionData) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <ConfirmationDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center space-x-4 space-y-0  p-7">
          <Button
            className="flex gap-2 items-center justify-center"
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/collections/${initialValue.id}`)
            }
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">Update a project</CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter name of the workspace"
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
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="Logo"
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
                          <p className="text-sm">Project Icon</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, SVG or JPEG up to 1MB
                          </p>
                          <input
                            type="file"
                            ref={inputRef}
                            className="hidden"
                            accept=".jpg, .png, .jpeg, .svg"
                            disabled={isProjectUpdatePending}
                            onChange={handleImageChange}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isProjectUpdatePending}
                              variant="destructive"
                              className="w-fit mt-2"
                              onClick={() => {
                                inputRef.current?.click();
                              }}
                            >
                              Upload Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isProjectUpdatePending}
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />

                <div className="py-7">
                  <DottedSeparator />
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    type="reset"
                    variant="secondary"
                    disabled={false}
                    onClick={onCancel}
                    className={cn(!onCancel && "invisible")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isProjectUpdatePending}>
                    Save changes
                  </Button>
                </div>
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
              Deleting a workspace is an irreversable proccess and will remove
              associated data
            </p>
            <DottedSeparator className="py-7" />
            <Button
              variant="destructive"
              size="sm"
              className="mt-6 w-fit ml-auto"
              disabled={isProjectUpdatePending || isProjectDeletePending}
              onClick={handleConfirm}
            >
              Delete workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
