"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type { NavigationItem } from "@/config/navigation";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";

type NavigationLinkProps = { item: NavigationItem; onNavigate?: () => void };

export function NavigationLink({ item, onNavigate }: NavigationLinkProps) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;
  const [open, setOpen] = useState(active);

  if (item.children?.length) return <div><button aria-expanded={open} className={cn("flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50", active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground")} onClick={() => setOpen((value) => !value)} type="button"><Icon aria-hidden="true" className="size-4" /><span className="flex-1">{t(item.label)}</span><ChevronDown aria-hidden="true" className={cn("size-4 transition-transform", open && "rotate-180")} /></button>{open ? <div className="ml-4 mt-1 space-y-1 border-l border-border pl-2">{item.children.map((child) => <NavigationLink item={child} key={child.href} onNavigate={onNavigate} />)}</div> : null}</div>;

  return <Link aria-current={active ? "page" : undefined} className={cn("flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50", active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground")} href={item.href} onClick={onNavigate}><Icon aria-hidden="true" className="size-4" /><span>{t(item.label)}</span></Link>;
}
