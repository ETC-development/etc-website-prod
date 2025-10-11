import { createClientSupabaseClient } from "@/lib/supabase/client";
import { Applicant } from "./Applicant";
import { Database } from "@/lib/database.types";

interface IAddApplicant {
    applicant: Applicant,
    applicantInfo: Applicant,
    setInsertionError: (error: string) => void,
    setApplicantInfo: (applicant: Applicant) => void,
    setInsertionMessage: (message: string) => void
}


export const applicantInfoEmpty: Applicant = {
    fullname: "",
    email: "",
    level: "",
    discord: "",
    self_description: "",
    dep_first_choice: "",
    dep_second_choice: "",
    dep_third_choice: "",
    first_choice_motivation: "",
    second_choice_motivation: "",
    third_choice_motivation: "",
    selection_justification: "",
    github_portfolio: "",
    discord_id: ""
};

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

export async function addNewApplicant({
                                          applicant,
                                          applicantInfo,
                                          setApplicantInfo,
                                          setInsertionError,
                                          setInsertionMessage
                                      }: IAddApplicant) {
    setInsertionError("");

    const supabase = createClientSupabaseClient();
    
    // Transform data to match database schema
    const registrationData = {
        fullname: applicant.fullname.trim(),
        email: applicant.email.trim().toLowerCase(),
        level: applicant.level as any,
        discord: applicant.discord.trim(),
        clubs_experience: applicant.self_description.trim(),
        dep_first_choice: applicant.dep_first_choice as any,
        dep_second_choice: applicant.dep_second_choice as any,
        dep_third_choice: applicant.dep_third_choice as any,
        first_choice_experience: applicant.first_choice_motivation.trim(),
        second_choice_experience: applicant.second_choice_motivation.trim(),
        third_choice_experience: applicant.third_choice_motivation.trim(),
        staying_motivated: applicant.selection_justification.trim(),
        github_portfolio: applicant.github_portfolio?.trim() || null
    };

    console.log("Submitting applicant:", registrationData);

    const { data, error } = await supabase
        .from("registerations-2k25-2k26")
        .insert(registrationData as any)
        .select();
    
    if (error) {
        console.error("Registration error:", error);
        let errorMsg = "There was an error while submitting your request, please try again";

        // Handle specific error codes
        if (error.code === "23505") {
            errorMsg = "You have registered already!";
            setApplicantInfo(applicantInfoEmpty);
        } else if (error.code === "42P01") {
            errorMsg = "Database configuration error. Please contact support.";
        } else if (error.message) {
            // Include the actual error message for debugging
            console.error("Detailed error:", error.message);
            errorMsg = "Registration failed. Please check your information and try again.";
        }

        setInsertionError(errorMsg);
        scrollToTop();
    }
    if (data) {
        setInsertionMessage("You have registered successfully!!");
        setApplicantInfo(applicantInfo);
        scrollToTop();
    }
}