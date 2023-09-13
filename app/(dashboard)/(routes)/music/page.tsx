"use client";

import * as z from "zod";
import axios from "axios";
import Heading from "@/components/Heading";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema } from "./contants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MusicIcon } from "lucide-react";

import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import ProModal from "@/components/ProModal";
import { useProModal } from "@/hooks/UseProModal";
import toast from "react-hot-toast";

const MusicPage = () => {
    const router = useRouter();

    const [music, setMusic] = useState<string>();
    const proModal = useProModal()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setMusic(undefined);
            const response = await axios.post("/api/music", values);
            setMusic(response.data.audio);
            form.reset();
        } catch (err: any) {
            if (err?.response?.status === 403) {
                proModal.onOpen()
            } else {
                toast.error("Something went wrong error")
            }
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="Music Generation"
                description="Type it to listen it"
                icon={MusicIcon}
                iconColor="text-orange-500"
                bgColor="bg-orange-500/10"
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
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="Mocking Bird - Eminem"
                                                {...field}
                                            />
                                        </FormControl>
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
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {!music && !isLoading && <Empty label="Yo!! No music generated" />}
                    {music && (
                        <audio controls className="w-full mt-8">
                            <source src={music} />
                        </audio>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MusicPage;
