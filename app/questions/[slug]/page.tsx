import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  QuestionListPage,
  questionListMetadata,
} from "@/components/QuestionListPage";
import { QUESTION_LISTS, questionListBySlug } from "@/data/questionLists";

interface QuestionPageProps {
  params: { slug: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return QUESTION_LISTS.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: QuestionPageProps): Metadata {
  const list = questionListBySlug(params.slug);
  return list ? questionListMetadata(list) : {};
}

export default function QuestionPage({ params }: QuestionPageProps) {
  const list = questionListBySlug(params.slug);
  if (!list) notFound();
  return <QuestionListPage list={list} />;
}
