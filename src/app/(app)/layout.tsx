import NavBar from "@/components/NavBar";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Soul feedback service ",
    description: "Free to use feedback service provider !",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <NavBar />
            {children}
        </>
    );
}