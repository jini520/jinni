import type { HTMLAttributes, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./project-markdown.module.scss";

// 프로젝트 콘텐츠 마크다운 렌더 (GFM + 코드 블록 하이라이트)
export const ProjectMarkdown = ({ content }: { content: string }) => (
  <div className={styles.contentMarkdown}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({
          className,
          children,
          ...props
        }: HTMLAttributes<HTMLElement> & {
          className?: string;
          children?: ReactNode;
        }) {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div">
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);
