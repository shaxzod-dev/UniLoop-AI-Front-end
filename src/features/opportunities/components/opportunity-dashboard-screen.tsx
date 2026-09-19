"use client";

import { useState } from "react";
import { ContextState } from "@/components/feedback/context-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/shared/page-container";
import { MutationFeedback } from "@/components/feedback/mutation-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AcademicEvidenceLinks } from "@/features/opportunities/components/academic-evidence-links";
import { CareerProfileCard } from "@/features/opportunities/components/career-profile-card";
import { ConsentControls } from "@/features/opportunities/components/consent-controls";
import { EndorsementPanel } from "@/features/opportunities/components/endorsement-panel";
import { GapAnalysis } from "@/features/opportunities/components/gap-analysis";
import { ProjectEvidenceList } from "@/features/opportunities/components/project-evidence-list";
import { ReadinessPanel } from "@/features/opportunities/components/readiness-panel";
import { RecommendationCard } from "@/features/opportunities/components/recommendation-card";
import { SkillEvidenceList } from "@/features/opportunities/components/skill-evidence-list";
import {
  useCreateClub,
  useOpportunityDashboard,
} from "@/features/opportunities/queries";
import { t } from "@/i18n";

type OpportunitySection = "profile" | "jobs" | "network" | "clubs" | "endorsements";

export function OpportunityDashboardScreen({ section }: { section?: OpportunitySection }) {
  const dashboard = useOpportunityDashboard();
  const createClub = useCreateClub();
  const [clubName, setClubName] = useState("");
  const [clubTopic, setClubTopic] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  if (dashboard.isLoading)
    return (
      <PageContainer className="py-8">
        <LoadingState cards={6} />
      </PageContainer>
    );
  if (dashboard.isError)
    return (
      <PageContainer className="py-8">
        <ErrorState retry={() => void dashboard.refetch()} />
      </PageContainer>
    );
  if (!dashboard.data)
    return (
      <PageContainer className="py-8">
        <EmptyState />
      </PageContainer>
    );
  const { profile, gaps, recommendations, projects, endorsementRequests } =
    dashboard.data;
  const connections = recommendations.filter(
    (item) =>
      item.opportunity.type !== "JOB" && item.opportunity.type !== "INTERNSHIP",
  );
  const careers = recommendations.filter(
    (item) =>
      item.opportunity.type === "JOB" || item.opportunity.type === "INTERNSHIP",
  );
  const primary = connections.find(
    (item) => item.status !== "DISMISSED" && item.status !== "ACCEPTED",
  );
  const orderedConnections = primary
    ? [primary, ...connections.filter((item) => item.id !== primary.id)]
    : connections;
  const shows = (name: OpportunitySection) => !section || section === name;
  return (
    <PageContainer className="space-y-8 py-8 sm:py-10">
      <header>
        <p className="text-sm font-medium text-primary">
          {t("homeLoopDevelopment")}
        </p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
          {t("navOpportunities")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {t("opportunityIntro")}
        </p>
      </header>
      {shows("profile") ? <section
        className="grid gap-4 lg:grid-cols-2"
        aria-label={t("careerProfile")}
      >
        <CareerProfileCard profile={profile} />
        <ReadinessPanel profile={profile} gaps={gaps} />
      </section> : null}
      {shows("clubs") ? <section>
        <Card className="max-w-3xl border-primary/20">
          <CardHeader>
            <CardTitle>{t("createClub")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-3 md:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!clubName.trim() || !clubTopic.trim() || !clubDescription.trim())
                  return;
                createClub.mutate(
                  {
                    title: clubName,
                    topic: clubTopic,
                    description: clubDescription,
                  },
                  {
                    onSuccess: () => {
                      setClubName("");
                      setClubTopic("");
                      setClubDescription("");
                    },
                  },
                );
              }}
            >
              <Input
                aria-label={t("clubName")}
                onChange={(event) => setClubName(event.target.value)}
                placeholder={t("clubName")}
                value={clubName}
              />
              <Input
                aria-label={t("clubTopic")}
                onChange={(event) => setClubTopic(event.target.value)}
                placeholder={t("clubTopic")}
                value={clubTopic}
              />
              <Input
                aria-label={t("clubDescription")}
                className="md:col-span-2"
                onChange={(event) => setClubDescription(event.target.value)}
                placeholder={t("clubDescription")}
                value={clubDescription}
              />
              <Button disabled={createClub.isPending} type="submit">
                {t("createClub")}
              </Button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              {t("createClubHint")}
            </p>
            <MutationFeedback
              error={createClub.isError}
              pending={createClub.isPending}
              success={createClub.isSuccess}
              successMessage="clubCreated"
            />
          </CardContent>
        </Card>
      </section> : null}
      {shows("profile") ? <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">
          {t("skillEvidence")}
        </h2>
        <AcademicEvidenceLinks />
        <SkillEvidenceList skills={profile.skills} studentLinks />
      </section> : null}
      {shows("profile") ? <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold">
          {t("projectEvidence")}
        </h2>
        <ProjectEvidenceList projects={projects} />
      </section> : null}
      {shows("profile") ? <section className="space-y-3">
        <h2 className="font-heading text-xl font-semibold">
          {t("gapAnalysis")}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("gapIntro")}
        </p>
        <GapAnalysis gaps={gaps} />
      </section> : null}
      {shows("network") ? <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">
          {t("navRecommendedConnections")}
        </h2>
        {!profile.consent.peerRecommendations ? (
          <ContextState
            title="noPeerConsentTitle"
            description="noPeerConsentDescription"
          />
        ) : null}
        {connections.length ? (
          <div className="grid items-start gap-4 lg:grid-cols-2">
            {orderedConnections.map((item) => (
              <RecommendationCard
                gaps={gaps}
                key={item.id}
                primary={item.id === primary?.id}
                profile={profile}
                recommendation={item}
              />
            ))}
          </div>
        ) : (
          <ContextState title="emptyTitle" description="emptyDescription" />
        )}
      </section> : null}
      {shows("jobs") ? <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">
          {t("recommendedCareer")}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("careerOpportunityNote")}
        </p>
        {careers.length ? (
          <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
            {careers.map((item) => (
              <RecommendationCard
                gaps={gaps}
                key={item.id}
                profile={profile}
                recommendation={item}
              />
            ))}
          </div>
        ) : (
          <ContextState title="emptyTitle" description="emptyDescription" />
        )}
      </section> : null}
      {shows("endorsements") ? <section
        className="grid items-start gap-4 xl:grid-cols-2"
        aria-label={t("navProfessorEndorsement")}
      >
        <EndorsementPanel
          availableProfessors={dashboard.data.availableProfessors}
          profile={profile}
          recommendations={recommendations}
          requests={endorsementRequests}
        />
        <ConsentControls consent={profile.consent} />
      </section> : null}
    </PageContainer>
  );
}
