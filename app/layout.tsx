import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Inter, Roboto } from "next/font/google";

import { cn } from "@/lib/utils";

import QueryProviders from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import UserProfileModal from "@/features/account/components/user-profile-modal";
import UserProfileSettingsModal from "@/features/account/components/user-profile-settings-modal";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import siteConfig from "@/config/site-config";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-sans",
	weight: ["400", "500", "700"],
});

const roboto = Roboto({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "700"],
	variable: "--font-roboto",
});

export const metadata = siteConfig;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn(` ${inter.className} antialiased`)}>
				<QueryProviders>
					<NuqsAdapter>
						<Suspense
							fallback={
								<Loader2 className="flex items-center justify-center mx-auto animate-pulse min-h-screen" />
							}
						>
							<UserProfileModal />
							<UserProfileSettingsModal />
						</Suspense>
						<main>{children}</main>
					</NuqsAdapter>
					<Toaster />
				</QueryProviders>
			</body>
		</html>
	);
}
