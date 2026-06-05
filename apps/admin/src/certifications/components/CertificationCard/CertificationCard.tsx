import {
  SortableCard,
  MetaRow,
  MetaItem,
  CalendarIcon,
  BuildingIcon,
  AwardIcon,
} from "../../../components";

export const CertificationCard = ({
  id,
  title,
  date,
  organization,
  tier,
  onEdit,
  onDelete,
}: {
  id: string;
  title: string;
  date?: string;
  organization?: string;
  tier?: string;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <SortableCard id={id} title={title} onEdit={onEdit} onDelete={onDelete}>
    <MetaRow>
      {date && <MetaItem icon={<CalendarIcon />}>{date}</MetaItem>}
      {organization && (
        <MetaItem icon={<BuildingIcon />}>{organization}</MetaItem>
      )}
      {tier && <MetaItem icon={<AwardIcon />}>{tier}</MetaItem>}
    </MetaRow>
  </SortableCard>
);
