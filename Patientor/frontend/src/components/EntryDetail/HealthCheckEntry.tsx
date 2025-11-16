import { type HealthCheckEntry } from "../../types";

const HealthCheckEntry = ({ entry }: { entry: HealthCheckEntry}) => {
  return (
    <div>
      healthcare rating: {entry.healthCheckRating}
    </div>
  );
};

export default HealthCheckEntry;