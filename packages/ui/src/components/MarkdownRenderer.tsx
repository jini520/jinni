import { marked } from 'marked';

interface Props {
  markdown: string;
  className?: string;
}

marked.setOptions({ breaks: true, gfm: true });

export function MarkdownRenderer({ markdown, className }: Props) {
  const html = String(marked.parse(markdown));
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
