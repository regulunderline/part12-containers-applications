import { type HospitalEntry } from "../../types";

const HealthCheckEntry = ({ entry }: { entry: HospitalEntry}) => {
  return (
    <div>
      discharged on {entry.discharge.date} 
      :{entry.discharge.criteria}
    </div>
  );
};

export default HealthCheckEntry;