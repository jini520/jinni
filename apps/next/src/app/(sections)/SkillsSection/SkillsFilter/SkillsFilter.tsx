"use client";

import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import LiquidGlass from "@/app/_components/LiquidGlass/LiquidGlass";
import SkillIcon from "@/app/_components/SkillIcon/SkillIcon";
import { IconNames } from "@/constants/iconRegistry";
import { Category, Skill } from "@/api/skills.types";
import "./skills-filter.scss";

interface SkillsFilterProps {
  sortedCategories: Category[];
  sortedSkills: Skill[];
}

const SkillsFilter = ({
  sortedCategories,
  sortedSkills,
}: SkillsFilterProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClickFilterItem = useCallback(
    (categoryId: string) => {
      if (selected === categoryId) {
        setSelected(null);
        return;
      }
      setSelected(categoryId || null);
    },
    [selected],
  );
  return (
    <div className="skills__section--filter">
      <div className="filter__container">
        <LiquidGlass className="filter__wrapper">
          <div className="filter">
            <ul className="filter__items">
              {sortedCategories.map((category) => (
                <li
                  key={category.id}
                  className={classNames("filter__item", {
                    selected: selected === category.id,
                  })}
                  onClick={() => handleClickFilterItem(category.id)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
        </LiquidGlass>
      </div>

      <div className="flex items-center justify-center">
        <div className="skill__icons">
          {sortedSkills.map((skill) => (
            <SkillIcon
              key={skill.id}
              className="skill__icon"
              size="lg"
              skill={skill.name as IconNames}
              selected={selected === skill.categoryId || selected === null}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsFilter;
