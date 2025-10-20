"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/constants/constants";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(API_URL + "/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResponseMessage(data.message || "Error submitting form");
    } catch (error) {
      setResponseMessage("Failed to connect to server.");
    }
  };

  return (
    <>
      <div></div>
    </>
  );

  //
  ///
  //
}

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

export default function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [responseMessage, setResponseMessage] = useState("");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(API_URL + "/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      setResponseMessage(data.message || "Error submitting form");
    } catch (error) {
      setResponseMessage("Failed to connect to server.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-md mx-auto"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <div>
              <FormItem className="flex items-center space-x-4">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
              </FormItem>
              <FormMessage />
              <FormDescription>
                This is your public display name.
              </FormDescription>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <div>
              <FormItem className="flex items-center space-x-4">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
              </FormItem>
              <FormMessage />
              <FormDescription>This is your pasword.</FormDescription>
            </div>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>

      {responseMessage && (
        <p className="mt-2 text-green-600">{responseMessage}</p>
      )}
    </Form>
  );
}
/*    <div className="p-4 max-w-md mx-auto">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded mt-2"
      />
      <textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        className="w-full p-2 border rounded mt-2"
        rows={4}
      />
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {responseMessage && (
        <p className="mt-2 text-green-600">{responseMessage}</p>
      )}
    </div> */
