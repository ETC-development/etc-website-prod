import { createServerSupabaseClientRW } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const origin = requestUrl.origin;

    let reason =
        requestUrl.searchParams.get("error_description") ?? requestUrl.searchParams.get("error");
    if (code) {
        const supabase = await createServerSupabaseClientRW();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) reason = error.message;
    } else reason ??= "No sign-in code was returned.";

    if (!reason) return NextResponse.redirect(`${origin}/registrations`);
    // Back to the form, which explains why the applicant is still signed out.
    console.error("Google sign-in failed:", reason);
    const back = new URL("/registrations", origin);
    back.searchParams.set("auth", "failed");
    back.searchParams.set("reason", reason.slice(0, 200));
    return NextResponse.redirect(back);
}
