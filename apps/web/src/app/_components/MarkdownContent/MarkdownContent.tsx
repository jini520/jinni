"use client";

import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import React, { useMemo, useEffect } from "react";
import classNames from "classnames";
import "./markdown-content.scss";

// highlight.js 테마 import (원하는 테마로 변경 가능)
import "highlight.js/styles/github-dark.css"; // VSCode 스타일과 유사

interface MarkdownContentProps {
  markdown: string;
  className?: string;
  theme?: "github-dark" | "github" | "vs2015" | "monokai" | "dracula";
}

/**
 * Markdown을 HTML로 렌더링하는 클라이언트 컴포넌트
 * highlight.js를 사용한 구문 강조 지원
 */
export default function MarkdownContent({
  markdown,
  className,
  theme = "github-dark",
}: MarkdownContentProps) {
  // 마크다운을 HTML로 변환 (구문 강조 포함)
  const htmlContent = useMemo(() => {
    if (!markdown) return "";

    // marked에 highlight.js 통합
    marked.use(
      markedHighlight({
        langPrefix: "hljs language-",
        highlight(code, lang) {
          const language = hljs.getLanguage(lang || "") ? lang : "plaintext";
          try {
            return hljs.highlight(code, { language }).value;
          } catch {
            return hljs.highlight(code, { language: "plaintext" }).value;
          }
        },
      })
    );

    return marked(markdown, {
      breaks: true, // 줄바꿈을 <br>로 변환
      gfm: true, // GitHub Flavored Markdown 지원
    });
  }, [markdown]);

  // 테마 변경 시 CSS 클래스 업데이트
  useEffect(() => {
    const preElements = document.querySelectorAll(".markdown-content pre");
    preElements.forEach((pre) => {
      pre.classList.remove(
        "hljs-github-dark",
        "hljs-github",
        "hljs-vs2015",
        "hljs-monokai",
        "hljs-dracula"
      );
      pre.classList.add(`hljs-${theme}`);
    });
  }, [theme, htmlContent]);

  return (
    <div
      className={classNames("markdown-content", className)}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
