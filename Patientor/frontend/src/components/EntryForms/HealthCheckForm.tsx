import { useState } from "react";
import { Alert, Button, FormControl, FormControlLabel, FormLabel, Input, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { Entry, HealthCheckRating } from "../../types";
import entryService from '../../services/entries';
import { AxiosError } from "axios";

const HealthCheckForm = ({ diagnosisCodes, id, addedEntry }: { 
  diagnosisCodes:string[], 
  id:string, 
  addedEntry: (entry: Entry) => void
}) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [rating, setRating] = useState('0');
  const [codes, setCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const newEntry = await entryService.create(({ entry: {
        type: 'HealthCheck',
        description,
        date,
        specialist,
        healthCheckRating: Number(rating) as unknown as HealthCheckRating,
        diagnosisCodes: codes
      }, id }));

      addedEntry(newEntry);

      setDescription('');
      setDate('');
      setSpecialist('');  
      setRating('');
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
      <h3>New HealthCheck Entry</h3>
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
          <FormControl>
            <FormLabel id="rating-label">rating</FormLabel>
            <RadioGroup
              aria-labelledby="rating-label"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            >
              <FormControlLabel value="0" control={<Radio />} label="0" />
              <FormControlLabel value="1" control={<Radio />} label="1" />
              <FormControlLabel value="2" control={<Radio />} label="2" />
              <FormControlLabel value="3" control={<Radio />} label="3" />
            </RadioGroup>
          </FormControl>
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

export default HealthCheckForm;