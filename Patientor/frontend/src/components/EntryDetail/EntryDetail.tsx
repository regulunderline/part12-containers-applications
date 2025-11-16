import { type Entry } from "../../types";
import HealthCheckEntry from './HealthCheckEntry';
import HospitalEntry from './HospitalEntry';
import OccupationalHealthcareEntry from './OccupationalHealthcareEntry';

const EntryDetails = ({ entry }: { entry: Entry}) => {
  switch (entry.type) {
    case 'HealthCheck':
      return <HealthCheckEntry entry={entry}/>;
    case 'Hospital':
      return <HospitalEntry entry={entry}/>;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareEntry entry={entry}/>;
    default:
      const assertNever = (v: never) => v;
      return assertNever(entry);
  }
};

export default EntryDetails;