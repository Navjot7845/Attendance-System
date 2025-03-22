"use client";
import { ThemeProvider } from "next-themes";
import React from "react";

export default function NextThemeProvider(props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
        {props.children}
    </ThemeProvider>
  );
}