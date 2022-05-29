import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Avatar, Box } from "@mui/material";
import type { Country } from "@prisma/client";

export default function Tags({ countries }: { countries: Country[] }) {
  return (
    <Autocomplete
      multiple
      id="tags-outlined"
      autoHighlight
      options={countries}
      getOptionLabel={(option) => option.name}
      filterSelectedOptions
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={option.name}
            avatar={<Avatar src={option.flag} alt="Flag" />}
            {...getTagProps({ index })}
            disabled={option.name === "Portugal"}
            key={option.id}
          />
        ))
      }
      renderInput={(params) => <TextField {...params} label="Participantes" />}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img loading="lazy" width="20" src={option.flag} alt="" />
          {option.name}
        </Box>
      )}
    />
  );
}
