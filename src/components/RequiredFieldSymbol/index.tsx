import classes from "./index.module.css";

function RequiredFieldSymbol() {
  return (
    <sub
      className={`${classes["required-field"]} ${classes["astrick-position"]}`}
    ></sub>
  );
}

export default RequiredFieldSymbol;
