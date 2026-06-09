import {
  SortableCard,
  MetaRow,
  MetaItem,
  CalendarIcon,
  BriefcaseIcon,
  UserIcon,
} from "@/components/common";
import { formatPeriod } from "@/utils/formatPeriod";
import styles from "./career-card.module.scss";

export const CareerCard = ({
  id,
  title,
  startDate,
  endDate,
  department,
  position,
  skills,
  details,
  onEdit,
  onDelete,
}: {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  department?: string;
  position?: string;
  skills?: string[];
  details?: string[];
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <SortableCard id={id} title={title} onEdit={onEdit} onDelete={onDelete}>
    <MetaRow>
      {startDate && (
        <MetaItem icon={<CalendarIcon />}>
          {formatPeriod(startDate, endDate)}
        </MetaItem>
      )}
      {department && <MetaItem icon={<BriefcaseIcon />}>{department}</MetaItem>}
      {position && <MetaItem icon={<UserIcon />}>{position}</MetaItem>}
    </MetaRow>

    {details && details.length > 0 && (
      <div className={styles.details}>
        <strong>업무 내용:</strong>
        <ul>
          {details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </div>
    )}

    {skills && skills.length > 0 && (
      <div className={styles.skills}>
        {skills.map((skill, index) => (
          <span key={index} className={styles.skillTag}>
            {skill}
          </span>
        ))}
      </div>
    )}
  </SortableCard>
);
