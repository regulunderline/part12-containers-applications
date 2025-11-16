import { type OccupationalHealthcareEntry } from "../../types";

const OccupationalHealthcareEntry = ({ entry }: { entry: OccupationalHealthcareEntry}) => {
  return (
    <div>
      employer name: {entry.employerName}
      {
        entry.sickLeave && 
          <div>
            sick leave from {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
          </div>
      }
    </div>
  );
};

export default OccupationalHealthcareEntry;