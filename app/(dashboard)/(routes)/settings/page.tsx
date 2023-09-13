import Heading from "@/components/Heading";
import SubscriptionButton from "@/components/SubscriptionButton";
import { checkSubscription } from "@/lib/subscription";
import { SettingsIcon } from "lucide-react";
import React from "react";

const SettingsPage = async () => {
    const isPro = await checkSubscription();
    return (
        <div>
            <Heading
                title="Settings"
                description="Manage Account Settings"
                icon={SettingsIcon}
                iconColor="text-gray-700"
                bgColor="bg-gray-700/10"
            />
            <div className="px-4 lg:px-8 space-y-4">
                <div className="text-muted-foreground text-sm">
                    {isPro ? "You are currently on a PRO plan" : "You are current on a free plan"}
                </div>
                <SubscriptionButton isPro={isPro} />
            </div>
        </div>
    );
};

export default SettingsPage;
