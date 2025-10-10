import { createServerClient, type CookieOptions } from "@supabase/ssr";
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
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set() {
                    // Do nothing in Server Components - cookies are read-only
                },
                remove() {
                    // Do nothing in Server Components - cookies are read-only
                },
            },
        }
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
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // Handle cookie setting errors in Server Actions/Route Handlers
                        console.error("Error setting cookie:", error);
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: "", ...options, maxAge: 0 });
                    } catch (error) {
                        // Handle cookie removal errors
                        console.error("Error removing cookie:", error);
                    }
                },
            },
        }
    );
}

// Alias for backwards compatibility and clarity
export const createServerSupabaseClientReadWrite = createServerSupabaseClientRW;