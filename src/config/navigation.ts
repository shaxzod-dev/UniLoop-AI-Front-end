import { BookOpenCheck, ClipboardList, Compass, LayoutDashboard, ListChecks, Presentation, ShieldCheck, type LucideIcon, Send, UsersRound } from "lucide-react";

import type { UserRole } from "@/features/auth/types";
import type { TranslationKey } from "@/i18n";

export type NavigationItem = {
  href: string;
  label: TranslationKey;
  icon: LucideIcon;
};

export const roleNavigation = {
  STUDENT: [
    { href: "/student/dashboard", label: "navDashboard", icon: LayoutDashboard },
    { href: "/student/courses", label: "navCourses", icon: BookOpenCheck },
    { href: "/student/opportunities", label: "navOpportunities", icon: Compass },
    { href: "/student/surveys", label: "navSurveys", icon: ClipboardList },
  ],
  PROFESSOR: [
    { href: "/professor/dashboard", label: "navDashboard", icon: LayoutDashboard },
    { href: "/professor/courses", label: "navCourses", icon: BookOpenCheck },
    { href: "/professor/referrals", label: "navReferrals", icon: Send },
    { href: "/professor/growth-plan", label: "navLearningPlan", icon: ListChecks },
    { href: "/professor/surveys", label: "navSurveys", icon: UsersRound },
  ],
  ADMIN: [
    { href: "/admin/dashboard", label: "navDashboard", icon: LayoutDashboard },
    { href: "/admin/students", label: "navStudents", icon: UsersRound },
    { href: "/admin/professors", label: "navProfessors", icon: Presentation },
    { href: "/admin/clubs", label: "navClubRequests", icon: ShieldCheck },
  ],
} as const satisfies Record<UserRole, readonly NavigationItem[]>;
