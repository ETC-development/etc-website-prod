import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

// Read-only Supabase client for Server Components
export async function createServerSupabaseClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll() {
                    // Do nothing in Server Components - cookies are read-only
                },
            },
        },
    );
}

// Read-write Supabase client for Server Actions and Route Handlers
export async function createServerSupabaseClientRW() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options),
                        );
                    } catch (error) {
                        // Handle cookie setting errors in Server Actions/Route Handlers
                        console.error("Error setting cookies:", error);
                    }
                },
            },
        },
    );
}

// Alias for backwards compatibility and clarity
export const createServerSupabaseClientReadWrite = createServerSupabaseClientRW;
