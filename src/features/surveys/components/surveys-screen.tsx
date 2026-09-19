"use client";

import { ClipboardList, ShieldCheck } from "lucide-react";
import { ContextState } from "@/components/feedback/context-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/shared/page-container";
import { Card, CardContent } from "@/components/ui/card";
import { useSurveys } from "@/features/surveys/queries";
import { SurveyCard } from "@/features/surveys/components/survey-card";
import { t } from "@/i18n";
import type { UserRole } from "@/features/auth/types";
import { FeedbackPanel } from "@/features/feedback/components/feedback-panel";

export function SurveysScreen({ role }: { role: UserRole }) {
  const surveys = useSurveys(role);
  if (surveys.isLoading)
    return (
      <PageContainer className="py-8">
        <LoadingState cards={2} />
      </PageContainer>
    );
  if (surveys.isError)
    return (
      <PageContainer className="py-8">
        <ErrorState
          retry={() => void surveys.refetch()}
          title="surveyErrorTitle"
        />
      </PageContainer>
    );
  return (
    <PageContainer className="space-y-6 py-8 sm:py-10">
      <header>
        <p className="text-sm font-medium text-primary">{t("navSurveys")}</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
          {t("navSurveys")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {t("surveysIntro")}
        </p>
      </header>
      <Card className="border-primary/15 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-primary"
          />
          <p className="text-sm leading-6 text-muted-foreground">
            {t("surveyPrivacyNote")}
          </p>
        </CardContent>
      </Card>
      <FeedbackPanel role={role} />
      <section aria-labelledby="survey-list-title">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList aria-hidden="true" className="size-5 text-primary" />
          <h2
            className="font-heading text-xl font-semibold"
            id="survey-list-title"
          >
            {t("navSurveys")}
          </h2>
        </div>
        {!surveys.data?.length ? <ContextState title="emptyTitle" description="surveyNoAvailable" /> : <div className="grid gap-4 lg:grid-cols-2">
          {surveys.data.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} />
          ))}
        </div>}
      </section>
    </PageContainer>
  );
}
