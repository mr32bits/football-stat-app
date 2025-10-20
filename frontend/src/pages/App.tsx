import { useState } from "react";
import reactLogo from "./../assets/react.svg";
import "./App.css";

import { Button } from "@/components/ui/button";
import { MenuBar } from "@/components/navigation-bars";
import { NotebookPen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function App() {
  return (
    <>
      <MenuBar />
      <Card>
        <CardHeader>
          <div className="flex flex-row gap-3">
            <NotebookPen className="w-10 h-10 bg-[linear-gradient(to_right,theme(colors.gray.300),theme(colors.zinc.400), theme(colors.gray.300))]" />
            <div className="flex flex-col flex-1">
              <CardTitle>Soccer Stats</CardTitle>
              <CardDescription>
                Overview for private Soccer matches
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="border-y">
          {/*<h1 className="animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-5xl font-black h-16">
            Testings
          </h1>*/}
          <h2>testing</h2>
        </CardContent>
        <CardFooter className="mt-2">
          <span className="text-xs text-muted-foreground">©MR</span>
        </CardFooter>
      </Card>
    </>
  );
}

export default App;
