"use client";

import { Editor } from "components/pages/Editor";

interface FileIdPageProps {
  params: { id: string };
}

export default function FileIdPage({ params }: FileIdPageProps) {
  return <Editor fileId={params.id} />;
}
