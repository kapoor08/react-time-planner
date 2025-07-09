export interface IServiceOption {
  label: string;
  value: string;
  time: string;
}

export const genderOptions = ["Male", "Female"];
export const serviceOptions: IServiceOption[] = [
  {
    label: "Haircut",
    value: "haircut",
    time: "",
  },
  {
    label: "Shave",
    value: "shave",
    time: "",
  },
  {
    label: "Beard Trim",
    value: "beard-trim",
    time: "",
  },
  {
    label: "Hair Coloring",
    value: "hair-coloring",
    time: "",
  },
  {
    label: "Facial",
    value: "facial",
    time: "",
  },
  {
    label: "Manicure",
    value: "manicure",
    time: "",
  },
  {
    label: "Pedicure",
    value: "pedicure",
    time: "",
  },
];
