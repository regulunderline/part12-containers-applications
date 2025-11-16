import { useState } from "react";
import { Alert, Button, Checkbox, FormControlLabel, Input, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material";
import { Entry, OccupationalHealthcareEntry } from "../../types";
import entryService from '../../services/entries';
import { AxiosError } from "axios";

const OccupationalHealthcareForm = ({ diagnosisCodes, id, addedEntry }: { 
  diagnosisCodes:string[], 
  id:string, 
  addedEntry: (entry: Entry) => void
}) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [sickLeave, setSickLeave] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [codes, setCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const newOccupationHealthCareEntry: Omit<OccupationalHealthcareEntry, 'id'> =  {
        type: 'OccupationalHealthcare',
        description,
        date,
        specialist,
        employerName,
        diagnosisCodes: codes
      };
      if(sickLeave) {
        newOccupationHealthCareEntry.sickLeave = { startDate, endDate };
      }
      const newEntry = await entryService.create(({ entry: newOccupationHealthCareEntry, id }));
      

      addedEntry(newEntry);

      setDescription('');
      setDate('');
      setSpecialist('');  
      setStartDate('');
      setEndDate('');
      setEmployerName('');
      setCodes([]);
      setSickLeave(false);
    } catch (e) {
      if (e instanceof AxiosError && e.response){
        setError(e.response.data);
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  return (
    <Paper elevation={1} sx={{ border: 1, borderColor: 'grey.500', p: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <h3>New Occupational Healthcare Entry</h3>
      <form onSubmit={handleSubmit}>
        <Paper elevation={2} sx={{ border: 1, borderColor: 'grey.500', p: 2, m: 1 }}>
          <TextField label="description" variant="standard" value={description} onChange={(event) => setDescription(event.target.value)}/>
        </Paper>
        <Paper elevation={2} sx={{ border: 1, borderColor: 'grey.500', p: 2, m: 1 }}>
          <InputLabel>
            date
            <Paper>
              <Input type="date" value={date} onChange={(event) => setDate(event.target.value)}/>
            </Paper>
          </InputLabel>
        </Paper>
        <Paper elevation={2} sx={{ border: 1, borderColor: 'grey.500', p: 2, m: 1 }}>
          <TextField label="specialist" variant="standard" value={specialist} onChange={(event) => setSpecialist(event.target.value)}/>
        </Paper>
        <Paper elevation={2} sx={{ border: 1, borderColor: 'grey.500', p: 2, m: 1 }}>
          <TextField label="employer name" variant="standard" value={employerName} onChange={(event) => setEmployerName(event.target.value)}/>
        </Paper>
        <FormControlLabel 
          control={<Checkbox checked={sickLeave} onChange={() => {
            const s = !sickLeave; 
            setSickLeave(s);
          }}/>} 
          label="sick leave" 
        />
        { sickLeave &&
          <Paper elevation={2} sx={{ border: 1, borderColor: 'grey.500', p: 2, m: 1 }}>
            <div>
                <InputLabel>
                  start date
                  <Input type="date" name="start date" value={startDate} onChange={(event) => setStartDate(event.target.value)}/>
                </InputLabel>
            </div>
            <div>
                <InputLabel>
                  end date
                  <Input type="date" name="end date" value={endDate} onChange={(event) => setEndDate(event.target.value)}/>
                </InputLabel>
            </div>
          </Paper>
        }
        <Paper elevation={2} sx={{ border: 1, borderColor: 'grey.500', p: 2, m: 1 }}>
          <InputLabel id="codes">Diagnosis Codes</InputLabel>
          <Select 
            labelId="codes"
            multiple 
            value={codes}
            onChange={(event) => setCodes(typeof event.target.value === 'string' ? [event.target.value] : event.target.value)}
          >
            {diagnosisCodes.map(code => 
              <MenuItem key={code} value={code}>{code}</MenuItem>
            )}
          </Select>
        </Paper>
        <div>
          <Button variant="contained" type="submit">Add</Button>
        </div>
      </form>
    </Paper>
  );
};

export default OccupationalHealthcareForm;