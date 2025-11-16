import { useState } from "react";
import { Alert, Button, Input, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material";
import { Entry } from "../../types";
import entryService from '../../services/entries';
import { AxiosError } from "axios";

const HospitalForm = ({ diagnosisCodes, id, addedEntry }: { 
  diagnosisCodes:string[], 
  id:string, 
  addedEntry: (entry: Entry) => void
}) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [criteria, setCriteria] = useState('');
  const [codes, setCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const newEntry = await entryService.create(({ entry: {
        type: 'Hospital',
        description,
        date,
        specialist,
        discharge : { date: dischargeDate, criteria },
        diagnosisCodes: codes
      }, id }));

      addedEntry(newEntry);

      setDescription('');
      setDate('');
      setSpecialist('');  
      setDischargeDate('');
      setCriteria('');
      setCodes([]);
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
      <h3>New Hospital Entry</h3>
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
          <InputLabel>
            discharge date
            <Paper>
              <Input type="date" value={dischargeDate} onChange={(event) => setDischargeDate(event.target.value)}/>
            </Paper>
          </InputLabel>
        </Paper>
        <Paper elevation={2} sx={{ border: 1, borderColor: 'grey.500', p: 2, m: 1 }}>
          <TextField label="discharge criteria" variant="standard" value={criteria} onChange={(event) => setCriteria(event.target.value)}/>
        </Paper>
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

export default HospitalForm;