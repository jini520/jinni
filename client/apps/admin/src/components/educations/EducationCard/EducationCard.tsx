import {
  SortableCard,
  MetaRow,
  MetaItem,
  CalendarIcon,
  AwardIcon,
} from "@/components/common";
import { formatPeriod } from "@/utils/formatPeriod";
import styles from "./education-card.module.scss";

export const EducationCard = ({
  id,
  title,
  startDate,
  endDate,
  status,
  description,
  onEdit,
  onDelete,
}: {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  description?: string;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <SortableCard id={id} title={title} onEdit={onEdit} onDelete={onDelete}>
    {description && <p className={styles.desc}>{description}</p>}
    <MetaRow>
      {startDate && (
        <MetaItem icon={<CalendarIcon />}>
          {formatPeriod(startDate, endDate)}
        </MetaItem>
      )}
      {status && <MetaItem icon={<AwardIcon />}>{status}</MetaItem>}
    </MetaRow>
  </SortableCard>
);
