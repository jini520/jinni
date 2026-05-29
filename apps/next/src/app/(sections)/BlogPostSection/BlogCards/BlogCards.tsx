"use client";

import React, { useCallback, useMemo, useState } from "react";
import { VelogPost } from "@/types/velog.types";
import LiquidGlass from "@/app/_components/LiquidGlass/LiquidGlass";
import BlogCard from "../BlogCard/BlogCard";
import Link from "next/link";
import { useMediaQueryContext } from "@/context/mediaQueryContext";
import "./blog-cards.scss";

interface BlogCardsProps {
  posts: VelogPost[];
}

const BlogCards = ({ posts }: BlogCardsProps) => {
  const { isMobile, isTablet, isDesktop, isWideDesktop } =
    useMediaQueryContext();

  const MIN_DISPLAY_COUNT = useMemo(() => {
    if (isTablet) return 4;
    if (isDesktop || isWideDesktop) return 6;
    return 3;
  }, [isMobile, isTablet, isDesktop, isWideDesktop]);

  const MAX_DISPLAY_COUNT = useMemo(() => {
    if (isTablet) return 8;
    if (isDesktop || isWideDesktop) return 12;
    return 3;
  }, [isMobile, isTablet, isDesktop]);

  const [itemPerLoad, setItemPerLoad] = useState(1);

  const canShowMore = useMemo(
    () => MIN_DISPLAY_COUNT * itemPerLoad < MAX_DISPLAY_COUNT,
    [itemPerLoad, MAX_DISPLAY_COUNT, MIN_DISPLAY_COUNT],
  );

  const handleShowMore = useCallback(() => {
    if (!canShowMore) return;
    setItemPerLoad((prev) => prev + 1);
  }, [canShowMore]);

  if (posts.length === 0) {
    return <div>게시물이 없습니다.</div>;
  }

  return (
    <div className="blog__cards-container">
      <div className="blog__cards">
        {posts.slice(0, MIN_DISPLAY_COUNT * itemPerLoad).map((post) => (
          <BlogCard key={post.link} {...post} />
        ))}
      </div>
      {canShowMore && (
        <button
          className="blog__card-more-button"
          onClick={handleShowMore}
          type="button"
        >
          <LiquidGlass className="blog__card-more-button-inner">
            더 보기
          </LiquidGlass>
        </button>
      )}
      {!canShowMore && (
        <Link
          href={`${process.env.NEXT_PUBLIC_BLOG_URL}/@${process.env.NEXT_PUBLIC_BLOG_USERNAME}`}
          className="blog__card-more-button"
          target="_blank"
        >
          <LiquidGlass className="blog__card-more-button-inner">
            블로그 바로가기
          </LiquidGlass>
        </Link>
      )}
    </div>
  );
};

export default BlogCards;
