import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  QuestionListPage,
  questionListMetadata,
} from "@/components/QuestionListPage";
import { KeywordPageView, keywordPageMetadata } from "@/components/KeywordPage";
import { QUESTION_LISTS, questionListBySlug } from "@/data/questionLists";
import { QUESTION_SLUG_PAGES, keywordPageByPath } from "@/data/keywordPages";

interface QuestionPageProps {
  params: { slug: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...QUESTION_LISTS.map((l) => ({ slug: l.slug })),
    ...QUESTION_SLUG_PAGES.map((p) => ({ slug: p.path.replace("/questions/", "") })),
  ];
}

export function generateMetadata({ params }: QuestionPageProps): Metadata {
  const list = questionListBySlug(params.slug);
  if (list) return questionListMetadata(list);
  const page = keywordPageByPath(`/questions/${params.slug}`);
  return page ? keywordPageMetadata(page) : {};
}

export default function QuestionPage({ params }: QuestionPageProps) {
  const list = questionListBySlug(params.slug);
  if (list) return <QuestionListPage list={list} />;
  const page = keywordPageByPath(`/questions/${params.slug}`);
  if (!page) notFound();
  return <KeywordPageView page={page} />;
}
