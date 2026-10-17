import type { Metadata } from "next";
import { connection } from "next/server";
import { RegisterClosed, RegisterFlow, RegisterHeader } from "@/components/register";
import { CLUB, registrationOpen } from "@/data/club";

export const metadata: Metadata = {
    title: "Join ETC",
    description:
        "Apply to join ENSIA Tech Community: connect Discord, rank your three cells, tell us about you.",
};

export default async function RegistrationPage() {
    // Render per request, so the page closes itself at REGISTRATION.closesAt without a redeploy.
    await connection();
    const club = CLUB;
    return (
        <div className="rg">
            <RegisterHeader />
            {registrationOpen() ? (
                <RegisterFlow discordInvite={club.discord_link} />
            ) : (
                <RegisterClosed discordInvite={club.discord_link} />
            )}
        </div>
    );
}
