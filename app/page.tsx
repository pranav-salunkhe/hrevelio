"use client";
import Shell from "@/ui/Shell";
import { Loader, ScrollArea } from "@mantine/core";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <ScrollArea scrollbars="x">
        <Shell></Shell>
      </ScrollArea>
      {/* <Loader></Loader> */}
    </main>
  );
}
