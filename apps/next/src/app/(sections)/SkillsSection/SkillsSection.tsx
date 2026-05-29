import React from "react";
import Section from "../../_components/Section/Section";
import { getSkills } from "@/api/skills.api";
import SkillsFilter from "./SkillsFilter/SkillsFilter";

const SkillsSection = async () => {
  const data = await getSkills();

  // 카테고리 order 순으로 정렬
  const sortedCategories = (() => {
    if (!data?.categories) return [];
    return [...data.categories].sort((a, b) => a.order - b.order);
  })();

  // 카테고리 order → 스킬 order 순으로 정렬
  const sortedSkills = (() => {
    if (!data?.skills || !data?.categories) return [];

    // 카테고리 ID → order 매핑
    const categoryOrderMap = new Map(
      data.categories.map((cat) => [cat.id, cat.order])
    );

    return [...data.skills].sort((a, b) => {
      // 1. 카테고리 order로 먼저 정렬
      const categoryOrderA = categoryOrderMap.get(a.categoryId) ?? 0;
      const categoryOrderB = categoryOrderMap.get(b.categoryId) ?? 0;

      if (categoryOrderA !== categoryOrderB) {
        return categoryOrderA - categoryOrderB;
      }

      // 2. 같은 카테고리 내에서는 스킬 order로 정렬
      return a.order - b.order;
    });
  })();

  return (
    <Section id="skills" className="section__skills">
      <h3 className="section__title">기술 스택</h3>
      <p className="section__description">아래 기술들을 사용할 수 있습니다.</p>

      <SkillsFilter
        sortedCategories={sortedCategories}
        sortedSkills={sortedSkills}
      />
    </Section>
  );
};

export default SkillsSection;
