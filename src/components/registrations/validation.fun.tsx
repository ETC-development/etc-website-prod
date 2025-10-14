import { Applicant } from "./Applicant";

export function validName(name: string) {
        const validNamePattern = /^[A-Za-z\s]+$/;
        return !(!name.match(validNamePattern) || !name.trim());

}

export function validEmail(email: string) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
}

export function validParagraph(paragraph: string) {

        const words = paragraph.split(/\s+/);

        return !(words.length < 5 || !paragraph.trim());

}

export function validOption(option: string) {
        return option;

}

export function validDiscord(discord: string) {
        // Discord tag can be:
        // - New format: @username or username (no discriminator)
        // - Old format: username#1234
        // We'll accept both formats and just check if it's not empty and has at least 2 characters
        const trimmed = discord.trim();
        
        if (!trimmed || trimmed.length < 2) {
                return false;
        }
        
        // Optional: More strict validation
        // Old format: username#0000-9999 or new format: @username or username
        const oldFormatPattern = /^.{2,32}#[0-9]{4}$/;
        const newFormatPattern = /^@?[a-z0-9_.]{2,32}$/i;
        
        return oldFormatPattern.test(trimmed) || newFormatPattern.test(trimmed);
}

export async function checkParagraphs(elements: string[], errors: Applicant, applicant: Applicant) {
        elements.forEach((element) => {
          if (!validParagraph(applicant[element])) {
            errors[element] = "You should provide at least 5 words.";
          }
        });
      }

export async function checkDepartments(elements: string[], errors: Applicant, applicant: Applicant) {
        elements.forEach((element) => {
          if (!validOption(applicant[element])) {
            errors[element] = "Please choose one department.";
          }
        });
      }