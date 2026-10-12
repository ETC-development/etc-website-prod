import { NextResponse, type NextRequest } from "next/server";

/**
 * Google sign-in that goes wrong inside Supabase (a school Workspace blocking the app, a database
 * error creating the user, an expired flow) is sent to the Site URL, the home page, with
 * `?error=...` or a bare `?code=...`. Send the applicant back to the form instead: the code to the
 * real callback, the error to /registrations where it is explained.
 */
export function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();
    if (url.searchParams.has("code")) {
        url.pathname = "/auth/callback";
        return NextResponse.redirect(url);
    }
    const reason = url.searchParams.get("error_description") ?? url.searchParams.get("error") ?? "";
    url.pathname = "/registrations";
    url.search = "";
    url.searchParams.set("auth", "failed");
    if (reason) url.searchParams.set("reason", reason.slice(0, 200));
    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        { source: "/", has: [{ type: "query", key: "code" }] },
        { source: "/", has: [{ type: "query", key: "error" }] },
    ],
};
