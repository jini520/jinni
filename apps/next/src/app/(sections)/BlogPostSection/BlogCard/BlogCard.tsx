import React from "react";
import LiquidGlass from "@/app/_components/LiquidGlass/LiquidGlass";
import classNames from "classnames";
import Link from "next/link";
import "./blog-card.scss";

interface BlogCardProps {
  title: string;
  link: string;
  pubDate: string;
}

const BlogCard = (post: BlogCardProps) => {
  const tagMatch = post.title.match(/\[([^\]]+)\]/);

  return (
    <Link href={post.link} target="_blank">
      <LiquidGlass className="blog__card">
        <div
          className={classNames(
            "blog__card-inner",
            `blog__card-inner--${
              tagMatch ? tagMatch[1].toLocaleLowerCase() : "default"
            }`
          )}
        >
          <div className="blog__card-title">{post.title}</div>
          <div className="blog__card-pubDate">{post.pubDate}</div>
        </div>
      </LiquidGlass>
    </Link>
  );
};

export default BlogCard;
