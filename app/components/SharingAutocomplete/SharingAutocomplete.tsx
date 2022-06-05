import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Avatar, Box } from "@mui/material";
import type { Country } from "@prisma/client";
import { useState } from "react";

export default function Tags({
  countries,
  extra,
}: {
  countries: Country[];
  extra: boolean;
}) {
  const [value, setValue] = useState<Country[]>([]);
  return (
    <>
      <Autocomplete
        multiple
        id="tags-outlined"
        autoHighlight
        options={countries}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        value={value}
        onChange={(e, newVal) => setValue(newVal)}
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
