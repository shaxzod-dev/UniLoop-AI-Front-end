"use client";

import { useState } from "react";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ProfessorCourseCard } from "@/features/courses/components/professor-course-card";
import { useCourses, useCreateProfessorCourse } from "@/features/courses/queries";
import { t } from "@/i18n";

export function ProfessorCourseList() {
  const courses = useCourses("PROFESSOR");
  const createCourse = useCreateProfessorCourse();
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  if (courses.isLoading)
    return (
      <PageContainer className="py-8">
        <LoadingState />
      </PageContainer>
    );
  if (courses.isError)
    return (
      <PageContainer className="py-8">
        <ErrorState retry={() => void courses.refetch()} />
      </PageContainer>
    );
  return (
    <PageContainer className="py-8 sm:py-10">
      <header className="mb-7">
        <p className="text-sm font-medium text-primary">
          {t("professorOverview")}
        </p>
        <h1 className="mt-1 font-heading text-3xl font-semibold">
          {t("navCourses")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("professorCoursesDescription")}
        </p>
      </header>
      <Card className="mb-7 max-w-2xl border-primary/20">
        <CardHeader>
          <CardTitle>{t("createCourse")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild className="mb-4"><Link href="/professor/courses/new">To‘liq kurs yaratish</Link></Button>
          <form
            className="grid gap-3 sm:grid-cols-[1fr_150px_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              if (!title.trim() || !code.trim()) return;
              createCourse.mutate(
                { title, code },
                { onSuccess: () => { setTitle(""); setCode(""); } },
              );
            }}
          >
            <Input
              aria-label={t("courseTitle")}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t("courseTitle")}
              value={title}
            />
            <Input
              aria-label={t("courseCode")}
              onChange={(event) => setCode(event.target.value)}
              placeholder={t("courseCode")}
              value={code}
            />
            <Button disabled={createCourse.isPending} type="submit">
              {t("createCourse")}
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            {t("createCourseHint")}
          </p>
        </CardContent>
      </Card>
      {courses.data?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.data.map((course) => (
            <ProfessorCourseCard course={course} key={course.id} />
          ))}
        </div>
      ) : null}
    </PageContainer>
  );
}
