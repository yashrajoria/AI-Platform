"use client"

import * as z from "zod"
import axios from "axios"
import Heading from '@/components/Heading'

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { formSchema } from "./contants"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { MessageSquare } from "lucide-react"
import { CreateChatCompletionRequestMessage } from "openai/resources/chat";
import Empty from "@/components/Empty"
import Loader from "@/components/Loader"
import { cn } from "@/lib/utils"
import UserAvatar from "@/components/UserAvatar"
import BotAvatar from "@/components/BotAvatar"
import { useProModal } from "@/hooks/UseProModal"
import toast from "react-hot-toast"



const ConversationPage = () => {
    const router = useRouter()

    const [messages, setMessages] = useState<CreateChatCompletionRequestMessage[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    })

    const isLoading = form.formState.isSubmitting;
    const proModal = useProModal()
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: CreateChatCompletionRequestMessage = {
                role: "user",
                content: values.prompt
            }
            const newMessages = [...messages, userMessage]
            const response = await axios.post("/api/conversation", { messages: newMessages });


            setMessages((current) => [...current, userMessage, response.data])

            form.reset()
        } catch (err: any) {
            if (err?.response?.status === 403) {
                proModal.onOpen()
            } else {
                toast.error("Something went wrong error")
            }
        } finally {
            router.refresh()
        }
    }

    return (
        <div><Heading
            title='Conversation'
            description='Our most comprehensive conversation tool'
            icon={MessageSquare}
            iconColor="text-violet-500"
            bgColor="bg-violet-500/10"
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
                                                placeholder="How do I find out volume of a cone?"
                                                {...field}
                                            />
                                        </FormControl>

                                    </FormItem>
                                )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
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
                    {messages.length === 0 && !isLoading && (
                        <Empty label="Yo!! No conversation started" />
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message) => (
                            <div key={message.content}
                                className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", message.role === "user" ? "bg-white-border border-black/10" : "bg-muted")}
                            >

                                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                <p className="text-sm">

                                    {message.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConversationPage