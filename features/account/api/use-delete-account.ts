import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export const useDeleteAccount = () => {
	const router = useRouter();

	const { mutate: deleteAccount, isPending } = useMutation({
		mutationFn: async () => {
			const response = await client.api.accounts.delete.$delete();

			if (!response.ok) {
				throw new Error("Something went wrong");
			}

			return await response.json();
		},
		onSuccess: (data) => {
			toast({
				description: data.message,
			});
			router.push("/sign-in");
		},
		onError: (error) => {
			toast({
				description: error.message,
				variant: "destructive",
			});
		},
	});

	return { deleteAccount, isPending };
};
