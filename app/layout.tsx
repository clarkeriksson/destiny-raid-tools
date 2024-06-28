import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {

    title: "Destiny Raid Tools",
    description: "",

};

export default function RootLayout({

    children,

}: Readonly<{

    children: React.ReactNode;

}>) {

    return (

        <html lang="en" className={`w-full h-full p-0 m-0`}>
        
            <body className={`flex flex-wrap ${inter.className} w-full h-full m-0 p-0`}>{children}</body>
        
        </html>
    
    );

}
