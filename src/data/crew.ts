/**
 * The crew shown on the home page: the president in the middle, the three key people below,
 * then every manager in a scrollable rail with cell filters.
 *
 * Portraits: put a square-ish photo (at least 600px, .webp or .jpg) in public/crew/ and set
 * `photo: "/crew/file-name.webp"`. Leave `photo` out to show the placeholder.
 * `cell` decides the filter chip and badge icon; leave it out for roles outside the cells.
 */
import type { CellKey } from "@/data/cells";

export type CrewMember = {
    name: string;
    role: string;
    /** Study level, e.g. "2CS". */
    level: string;
    cell?: CellKey;
    photo?: string;
    linkedin?: string;
    github?: string;
};

export const CREW_SEASON = "2026/27";

export const PRESIDENT: CrewMember = {
    name: "Yasser BENAHMED",
    role: "President",
    level: "3Y",
    photo: "/crew/yasser-benahmed.webp",
};

/** Exactly three, in display order. */
export const KEY_PEOPLE: CrewMember[] = [
    { name: "Lyes HADJAR", role: "Vice President", level: "5Y", photo: "/crew/lyes-hadjar.webp" },
    { name: "Fatima Zohra Doua BOURZAK", role: "General Secretary", level: "4Y", photo: "/crew/fatima-zohra-doua-bourzak.webp" },
    { name: "Yassir CHERDOUH", role: "Project Manager", level: "4Y", photo: "/crew/yassir-cherdouh.webp" },
];

/** Everyone else, in display order. */
export const MANAGERS: CrewMember[] = [
    { name: "Abdelhak KADOUCI", role: "IT Co-Manager", level: "4Y", photo: "/crew/abdelhak-kadouci.webp", cell: "development" },
    { name: "Youcef Mhammdi BOUZINA", role: "IT Co-Manager", level: "5Y", photo: "/crew/youcef-mhammdi-bouzina.webp", cell: "development" },

    { name: "Redhouane LAZIB", role: "AI & Data Science Manager", level: "5Y", photo: "/crew/redhouane-lazib.webp", cell: "ai" },

    { name: "Amina FERHAOUI", role: "Design Manager", level: "3Y", photo: "/crew/amina-ferhaoui.webp", cell: "design" },
        { name: "Norhane LEGHLAM", role: "Design Team", level: "3Y", photo: "/crew/norhane-leghlam.webp", cell: "design" },
        { name: "Israa BENABDELKRIM", role: "Design Team", level: "3Y", photo: "/crew/israa-benabdelkrim.webp", cell: "design" },

    { name: "Mohammed Radhoine AMARA", role: "Relex Co-Manager", level: "4Y", photo: "/crew/mohammed-radhoine-amara.webp", cell: "relex" },
    { name: "Sarah BOUKELLAL", role: "Relex Co-Manager", level: "2Y", photo: "/crew/sarah-boukellal.webp", cell: "relex" },
    { name: "Akram Zakaria NACEUR", role: "Relex Co-Manager", level: "2Y", photo: "/crew/akram-zakaria-naceur.webp", cell: "relex" },

    { name: "Asma HAMAMTI", role: "Multimedia Co-Manager", level: "3Y", photo: "/crew/asma-hamamti.webp", cell: "multimedia" },
    { name: "Zakaria Abdenour MEKKI", role: "Multimedia Co-Manager", level: "3Y", photo: "/crew/zakaria-abdenour-mekki.webp", cell: "multimedia" },
    { name: "Nour RAHIAOUI", role: "Multimedia Co-Manager", level: "3Y", photo: "/crew/nour-yahiaoui.webp", cell: "multimedia" },
    { name: "Yousra BEDJGHIT", role: "Production Manager", level: "3Y", photo: "/crew/yousra-bedjghit.webp", cell: "multimedia" },

    { name: "Ayat-Errahmane NACER", role: "HR Lead", level: "4Y", photo: "/crew/ayat-errahmane-nacer.webp" },
        { name: "Maria Ines RAHEB", role: "HR Team", level: "3Y", photo: "/crew/maria-ines-raheb.webp" },
        { name: "Houda BOUSLAMA", role: "HR Team", level: "4Y", photo: "/crew/houda-bouslama.webp" },

    { name: "Zakaria AMMAR", role: "Logistics Manager", level: "3Y", photo: "/crew/zakaria-ammar.webp", cell: "events" },
    { name: "Sirine ATOUM", role: "Planning Manager", level: "4Y", photo: "/crew/sirine-atoum.webp", cell:"events" },

    { name: "Maissa BRIBER", role: "Marketing Manager", level: "3Y", photo: "/crew/maissa-briber.webp", cell: "marketing" },

    { name: "Malak BOUHADDAD", role: "Community Manager", level: "3Y", photo: "/crew/malak-bouhaddad.webp", cell: "marketing" },

    { name: "Mohamed Charaf Eddine DEGHBOUDJ", role: "External Activity Manager", level: "3Y", photo: "/crew/mohamed-charaf-eddine-deghboudj.webp", cell: "relex" },

    { name: "Kaouther BENSADDEK", role: "Training Manager", level: "4Y", photo: "/crew/kaouther-bensaddek.webp" },

    { name: "Manel Bouchra DEBAB", role: "Project Coordinator", level: "3Y", photo: "/crew/manel-bouchra-debab.webp" },
];
