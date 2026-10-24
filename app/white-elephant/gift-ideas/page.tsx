import { notFound } from "next/navigation";
import { KeywordPageView, keywordPageMetadata } from "@/components/KeywordPage";
import { keywordPageByPath } from "@/data/keywordPages";

const page = keywordPageByPath("/white-elephant/gift-ideas");

export const metadata = page ? keywordPageMetadata(page) : {};

export default function Page() {
  if (!page) notFound();
  return <KeywordPageView page={page} />;
}
