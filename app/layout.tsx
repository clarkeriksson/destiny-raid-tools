import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";

const roboto_mono = Roboto_Mono({ subsets: ["latin"] });

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
        
            <body className={`flex flex-wrap ${roboto_mono.className} w-full h-full m-0 p-0`}>{children}</body>
        
        </html>
    
    );

}
