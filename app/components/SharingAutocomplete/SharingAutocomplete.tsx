import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Avatar, Box } from "@mui/material";
import type { Country } from "@prisma/client";
import { useState } from "react";

export default function Tags({
  countries,
  extra,
  defaultValue,
}: {
  countries: Country[];
  extra: boolean;
  defaultValue?: Country[];
}) {
  const [value, setValue] = useState<Country[]>(defaultValue || []);
  console.log(countries);
  console.log(defaultValue);
  return (
    <>
      <Autocomplete
        isOptionEqualToValue={(option, value) => {
          console.log(option.id, value.id);
          console.log(option.id == value.id);
          return option.id == value.id;
        }}
        multiple
        id="tags-outlined"
        autoHighlight
        options={countries}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        value={value}
        fullWidth
        onChange={(e, newVal) => setValue(newVal)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.name}
              avatar={<Avatar src={option.flag} alt="Flag" />}
              {...getTagProps({ index })}
              key={option.id}
            />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label={`Nações${extra ? " Extra" : ""}`} />
        )}
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
      <input
        type="hidden"
        name="sharingCountries"
        value={value.map((val) => val.id).join(",")}
      />
    </>
  );
}
