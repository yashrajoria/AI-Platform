"use client";

import * as z from "zod";
import axios from "axios";
import Heading from "@/components/Heading";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { amountOptions, formSchema, resolutionOptions } from "./contants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";

//!TODO: FIX ISSUE OF THE SOURCE NOT READING FROM THE FROM THE RESPONSE CHECK WHAT IS WRONG 

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import { Download } from "lucide-react";

const ImagePage = () => {
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            amount: "1",
            resolution: "512x512",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        setImages([])
        try {
            setImages([]);
            const response = await axios.post("/api/image", values);

            //?TEST FROM HERE

            console.log(typeof response);
            console.log(typeof response.data);
            const dataArray = [response.data]

            // Assuming response.data is already an array of objects with a 'url' property
            const urls = dataArray.map((image: { url: string }) => image.url);
            console.log("URLs setting in state", urls)
            setImages(urls);
        } catch (error) {
            console.error("[API Request Error]", error);
            // Handle errors here
        } finally {
            router.refresh();
        }

    };

    return (
        <div>
            <Heading
                title="Image Generation"
                description="Let Genesis Show You The Best Of Images!!"
                icon={ImageIcon}
                iconColor="text-pink-700"
                bgColor="bg-pink-700/10"
            />
            <div className="px-4 lg:x-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-6">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="Get the best images!!"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="resolution"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {resolutionOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {amountOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="col-span-12 lg:col-span-2 w-full"
                                disabled={isLoading}
                            >
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-20">
                            <Loader />
                        </div>
                    )}
                    {images.length === 0 && !isLoading && (
                        <Empty label="Yo!! No Images generated" />
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                        {images.map((src) => (
                            <Card key={src} className="rounded-lg overflow-hidden">
                                <div className="relative aspect-square">
                                    <Image alt="Image"
                                        fill
                                        src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-g9zMWVpfHyCvXae1Mhqd1LiJ/user-T4GzapuYMeZUPxvGJct4kPsa/img-VQv883WCSCPpq8IeoMlOZ8AM.png?st=2023-09-07T07%3A13%3A44Z&se=2023-09-07T09%3A13%3A44Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-09-06T23%3A49%3A55Z&ske=2023-09-07T23%3A49%3A55Z&sks=b&skv=2021-08-06&sig=o8rD5NSpaO%2BAfUuRj9wdy43QMcwELpqZyzTG3WJ2nmw%3D" />
                                </div>
                                <CardFooter className="p-2">
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => window.open(src)}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImagePage;
